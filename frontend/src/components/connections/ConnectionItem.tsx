import { useNavigate } from "react-router-dom";
import { useGetUserInfoFromId } from "@/api/query/UserQueries";
import '@/styles/components-styles/connections/ConnectionItem.css';
import { useAuth } from "@context/AuthContext";
import { useState } from "react";

type ConnectionItemProp = { 
    id: number; 
    index: number;
    isFollowing: boolean;
}

export default function ConnectionItem({id, index, isFollowing}: ConnectionItemProp) {
    const {authUser} = useAuth();

    const {data: user} = useGetUserInfoFromId(id);
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <div key={index} className="connectionEntityItem" onClick={()=> {
            navigate(`/${user?.data.username}`)
        }}>
            <div className="profilePhotoConnectionPageContainer">
                <img src={user?.data.profilePhoto} className="profilePhotoConnectionPage"/>
            </div>
            <div className="userInfoContainer">
                <span className="userNameConnectionItemText">{user?.data.name}</span>
                <span className="usernameConnectionItemText">@{user?.data.username}</span>
                {
                    user?.data.bio && (
                        <span>{user?.data.bio}</span>
                    )
                }
            </div>
            <div className="followButtonContainer" onMouseEnter={()=> {setIsHovered(true)}} onMouseLeave={()=> {setIsHovered(false)}}>
                {
                    authUser?.id !== user?.data.id && (
                        isFollowing ? (
                            isHovered ? (
                                <button className="unfollowButton">Unfollow</button>
                            ) : (
                                <button className="followButton">Following</button>
                            )
                        ) : (
                            <button className="followButton">Follow</button>
                        )
                    )
                }
            </div>
        </div>
    )
}