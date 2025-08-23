import { useState } from "react"
import "@styles/components-styles/ProfilePageTabs.css";
import type { PostEntity } from "@/types/Posts/PostEntity";
import PostCard from "@/components/posts/PostCard";
import type { User } from "@/types/Users/User";
import type { AxiosResponse } from "axios";
import type { UseQueryResult } from "@tanstack/react-query";
import { OrbitProgress } from "react-loading-indicators";
import ErrorMessage from "@/components/ErrorMessage";

type TabType = {
    tabTitle: string;
    tabContent: Object[];
}

type TabTypeProp = {
    authUser: User | null;
    userProfileName: string;
    tabs: (TabType | null)[];
    isUserPostLoading: boolean;
    userPostQueryData?: AxiosResponse<any, any>;
    refetchAllPosts?: () => void;
    userLikedPostsResult?: UseQueryResult<AxiosResponse<any, any>, Error>;
    userBookmarkedPostsResult?: UseQueryResult<AxiosResponse<any, any>, Error>;
    userLikedPostEntities?:AxiosResponse<any, any>;
}

export default function ProfilePageTabs({ authUser,
    tabs,userProfileName,
    isUserPostLoading,
    userPostQueryData,
    refetchAllPosts,
    userLikedPostsResult,
    userBookmarkedPostsResult, userLikedPostEntities }: TabTypeProp) {

    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
    const activateTab = (index: number) => {
        setActiveTabIndex(index);
    }

    return (
        <div className="tabsContainer">
            <div className="tabHeadingContainer">
                {tabs.filter((t): t is TabType => t !== null).map((tab, index) => (
    <label
      key={index}
      className={index === activeTabIndex ? "active-tab" : "tab"}
      onClick={() => activateTab(index)}
    >
      {tab.tabTitle}
    </label>
  ))}
            </div>
            <div className="content">
                {isUserPostLoading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <OrbitProgress color="#1DA1F2" size="medium" text="" textColor="" />
                    </div>
                ) : tabs[activeTabIndex]?.tabTitle === "Posts" ? (
                    authUser && userPostQueryData ? (
                        (() => {
                            const originalPosts = (tabs[activeTabIndex].tabContent as PostEntity[])
                                .filter((post) => post.postType === "ORIGINAL");

                            return originalPosts.length > 0 ? (
                                originalPosts.map((post, index) => (
                                    <PostCard
                                        key={index}
                                        userId={post.userId}
                                        postEntity={post}
                                        refetch={refetchAllPosts}
                                        userLikedPostsResult={userLikedPostsResult}
                                        userBookmarkedPostsResult={userBookmarkedPostsResult}
                                    />
                                ))
                            ) : (
                                <ErrorMessage 
                                    title="No Posts found." 
                                    message={authUser.username === userProfileName ? (
                                        "Try posting something."
                                    ) : ("This person hasn't posted anything yet.")}
                                />
                            );
                        })()
                    ) : (
                        <ErrorMessage 
                            title="No Posts found." 
                            message={authUser && authUser.username === userProfileName ? (
                                "Try posting something."
                            ) : ("This person hasn't posted anything yet.")}
                        />
                    )
                ) : tabs[activeTabIndex]?.tabTitle === "Replies" ? (
                    authUser && userPostQueryData ? (
                        (() => {
                            const replyPosts = (tabs[activeTabIndex].tabContent as PostEntity[])
                                .filter((post) => post.postType === "REPLY");

                            return replyPosts.length > 0 ? (
                                replyPosts.map((post, index) => (
                                    <PostCard
                                        key={index}
                                        userId={authUser.id}
                                        postEntity={post}
                                        refetch={refetchAllPosts}
                                        userLikedPostsResult={userLikedPostsResult}
                                        userBookmarkedPostsResult={userBookmarkedPostsResult}
                                    />
                                ))
                            ) : (
                                <ErrorMessage 
                                    title="No Replies found." 
                                    message={authUser.username === userProfileName ? (
                                        "Try posting something."
                                    ) : ("This person hasn't replied to any post yet.")}
                                />
                            );
                        })()
                    ) : (
                        <ErrorMessage 
                            title="No Replies found." 
                            message={authUser && authUser.username === userProfileName ? (
                                "Try replying to some post."
                            ) : ("This person hasn't replied to any post yet.")}
                        />
                    )
                ) : tabs[activeTabIndex]?.tabTitle === "Quote Retweets" ? (
                    authUser && userPostQueryData ? (
                        (() => {
                            const replyPosts = (tabs[activeTabIndex].tabContent as PostEntity[])
                                .filter((post) => post.postType === "QUOTE");

                            return replyPosts.length > 0 ? (
                                replyPosts.map((post, index) => (
                                    <PostCard
                                        key={index}
                                        userId={authUser.id}
                                        postEntity={post}
                                        refetch={refetchAllPosts}
                                        userLikedPostsResult={userLikedPostsResult}
                                        userBookmarkedPostsResult={userBookmarkedPostsResult}
                                    />
                                ))
                            ) : (
                                <ErrorMessage 
                            title="No Quote Retweets found." 
                            message={authUser && authUser.username === userProfileName ? (
                                "Try quote retweeting something."
                            ) : ("This person hasn't quote retweeted any post yet.")}
                        />
                            );
                        })()
                    ) : (
                        <ErrorMessage 
                            title="No Posts found." 
                            message={authUser && authUser.username === userProfileName ? (
                                "Try quote retweeting something."
                            ) : ("This person hasn't quote retweeted any post yet.")}
                        />
                    )
                ): tabs[activeTabIndex]?.tabTitle === "Likes" ? (
                    authUser && userLikedPostEntities?.data  ? (
                        (() => {
                            const likedPosts = tabs[activeTabIndex].tabContent as PostEntity[];
                            return likedPosts.length > 0 ? (
                                likedPosts.map((like, index) => (
                                <PostCard
                                    key={index}
                                    userId={authUser.id}
                                    postEntity={like} 
                                    refetch={refetchAllPosts}
                                    userLikedPostsResult={userLikedPostsResult}
                                    userBookmarkedPostsResult={userBookmarkedPostsResult}
                                />
                            ))
                            ) : (
                                <ErrorMessage 
                                    title="No liked posts found." 
                                    message={authUser && authUser.username === userProfileName ? (
                                        "Try liking some post."
                                    ) : ("This person hasn't liked any post yet.")}
                                />
                            );
                        })()
                    ) : (
                        <ErrorMessage 
                            title="No liked posts found." 
                            message={authUser && authUser.username === userProfileName ? (
                                "Try liking some post."
                            ) : ("This person hasn't liked any post yet.")}
                        />
                    )
                ): null}
            </div>
        </div>
    )
}