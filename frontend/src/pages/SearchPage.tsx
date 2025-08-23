import { useGetSearchResults } from "@api/query/TimelineQueries";
import { useLocation, useNavigate } from "react-router-dom";
import "@styles/pages-styles/SearchPage.css";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserByUserId } from "@api/service/UserService";
import type { AxiosResponse } from "axios";
import type { User } from "@/types/Users/User";
import type { PostEntity } from "@/types/Posts/PostEntity";
import { getPostByPostId } from "@/api/service/PostingService";
import PostCard from "@/components/posts/PostCard";
import SearchField from "@/components/SearchField";

export default function SearchPage() {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q") ?? "";
    const { data: searchResult } = useGetSearchResults(query);
    const navigate = useNavigate();
    
    useEffect(() => {
        document.title = query === "" ? "Explore" : `Search results for: "${query}"`;
    }, [query]);

    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<PostEntity[]>([]);

    useEffect(() => {
        if (!searchResult || !searchResult.users || searchResult.users.length === 0) return;

        const fetchUsers = async () => {
            try {
                const results = await Promise.all(
                    searchResult.users.map((userId: number) => getUserByUserId(userId))
                );
                // results is an array of AxiosResponses<User>, so extract .data
                setUsers(results.map((res: AxiosResponse<User>) => res.data));
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchUsers();
    }, [searchResult]);

    useEffect(() => {
        if (!searchResult || !searchResult.posts || searchResult.posts.length === 0) return;
        const fetchPosts = async () => {
            try {
                const results = await Promise.all(
                    searchResult.posts.map((postId: number) => getPostByPostId(postId))
                );
                // results is an array of AxiosResponses<User>, so extract .data
                setPosts(results.map((res: AxiosResponse<PostEntity>) => res.data));
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchPosts();
    }, [searchResult]);

    return (
        <div className="searchResultsPageContainer">
            <div className="notificationHeadingContainer">
                <div className="arrowLeftNotificationViewerHeaderContainer">
                    <ArrowLeft
                        className="arrowLeftNotificationViewerHeader"
                        size={20}
                        onClick={() => {
                            if (window.history.length > 1) {
                                navigate(-1);
                            } else {
                                navigate('/home');
                            }
                        }}
                    />
                </div>
                <span className="notificationHeaderHeadingSpan">
                    {query === "" ? ("Explore") : (`Search Results for: "${query}"`)}
                </span>
            </div>
            <SearchField />
            {
                query === "" && <p style={{fontStyle:"italic", textAlign:'center', color:'grey'}}>Search something</p>
            }
            {
                query !== "" && (
                    <div className="allUsersContainer">
                        <span style={{ fontSize: "20px", fontWeight: "bold" }}>Users</span>

                        <div className="userListContainer">
                            {
                                query !== "" && users.length > 0 ? (
                                    users.map((user: User, index: number) => (
                                        <div className="searchResultUserProfileContainer" onClick={() => { navigate(`/${user.username}`) }} key={index}>
                                            <div className="searchResultProfilePhotoContainer">
                                                <img src={user.profilePhoto} className="searchResultProfilePhoto" />
                                            </div>
                                            <div className="searchResultUserInfoContainer">
                                                <span style={{ fontWeight: 'bold' }}>{user.name}</span>
                                                <span style={{ color: 'grey' }}>@{user.username}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <span>No users found.</span>
                                )
                            }
                        </div>
                    </div>
                )
            }
            {
                query !== "" && (
                    <div className="allUsersContainer">
                        <span style={{ fontSize: "20px", fontWeight: "bold" }}>Post</span>
                        {
                            posts.length > 0 ? (
                                posts.map((post: PostEntity, index: number) => (
                                    <PostCard userId={post.userId} postEntity={post} key={index} />
                                ))
                            ) : (
                                <span>No posts found.</span>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}