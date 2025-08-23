import { useParams } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { useGetUserConnections, useGetUserInfoFromUsername } from "@/api/query/UserQueries";
import ConnectionItem from "@components/connections/ConnectionItem";

import '@/styles/pages-styles/ConnectionPage.css';
import ConnectionPageHeader from "@components/connections/ConnectionPageHeader";
import ConnectionErrorMessages from "@components/connections/ConnectionErrorMessages";
import type { FollowerFolloweeNumbers } from "@/types/Connections/FollowerFolloweeNumbers";
import { extractIdsFromDTO } from "@/methods/ExtractUsers";

export default function ConnectionPage() {
    const {authUser} = useAuth();

    const { username } = useParams<{ username: string }>();
    const { connectionType } = useParams<{ connectionType: string }>();

    const { data: userInfo } = useGetUserInfoFromUsername(username!);
    const userId = userInfo?.data?.id ?? -1;
    
    const {data: userConnectionQueryData}= useGetUserConnections(userId);
    const followers = userConnectionQueryData?.data.followerList;
    const followees = userConnectionQueryData?.data.followeeList;

    const dto = userConnectionQueryData?.data;
    const idNumbers: FollowerFolloweeNumbers | null = dto ? extractIdsFromDTO(dto) : null;
    //const isFollowing = idNumbers?.follower.includes(authUser?.id ?? -1);
        
    if (connectionType === "followers"){
        if (followers?.length === 0){
            if (authUser?.username === username){
                return ( 
                <ConnectionErrorMessages heading="No followers" message="You don't have any followers" userInfo={userInfo?.data}/>);
            }
            else {
                return (<ConnectionErrorMessages userInfo={userInfo?.data} heading="No followees" message="This person is not following anyone" />)
            }
        }
        else {
            return (
                <div className="connectionContentContainer">
                    <ConnectionPageHeader 
                        previousPageUrl={`/${username}`} 
                        username={username!} 
                        name={userInfo?.data.name} 
                    />
                    {
                        followers?.map((follower, index: number) => {
                            const isUserFollowingThisPerson = idNumbers?.followee.includes(follower.followerId);
                            return (
                                <ConnectionItem
                                    id={follower.followerId}
                                    key={index}
                                    index={index}
                                    isFollowing={isUserFollowingThisPerson!}
                                />
                            );
                        })
                    }
                </div>
            )
        }
    }
    
    if (connectionType === "following"){
        if (followees?.length === 0){
            if (authUser?.username === username){
                return (<ConnectionErrorMessages userInfo={userInfo?.data} heading="No followees" message="You aren't following anyone. Search users to follow someone"/>);
            }
            else {
                return (<ConnectionErrorMessages userInfo={userInfo?.data} heading="No followees" message="This person is not following anyone" />)
            }
        }
        else {
            return (
                <div className="connectionContentContainer">
                    <ConnectionPageHeader 
                        previousPageUrl={`/${username}`} 
                        username={username!} 
                        name={userInfo?.data.name} 
                    />
                    {
                        followees?.map((followee, index: number) => (
                            <ConnectionItem id={followee.followeeId} 
                            index={index} key={index} isFollowing={true} />
                        ))
                    }
                </div>
            )
        }
    }

    else {
        return (<ConnectionErrorMessages heading="This page doesn't exist." message="Try some other URL."/>)
    }
}