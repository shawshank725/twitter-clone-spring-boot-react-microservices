import { useNavigate, useParams } from "react-router-dom"
import "@styles/pages-styles/PostViewerPage.css";
import { ArrowLeft, MessageCircle, Repeat2 } from "lucide-react";
import {  useGetUserInfoFromId } from "@/api/query/UserQueries";
import PostMediaDisplayer from "@components/posts/PostMediaDisplayer";
import { useEffect, useState } from "react";
import useOutsideAlerter from "@hooks/useOutsideAlerter";
import PhotoViewer from "@components/PhotoViewer";
import { leadUserToProfilePage, parseDate } from "@methods/OtherMethods";

import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from "@context/AuthContext";
import PostingArea from "@components/posts/PostingArea";
import PostCard from "@components/posts/PostCard";
import PostModal from "@components/posts/PostModal";
import { addRemoveBookmark, addRemoveLike, hasUserBookmarkedPost, hasUserLikedPost } from "@methods/PostInformationMethods";
import MentionParser from "@methods/ParseText";
import type { PostEntity } from "@/types/Posts/PostEntity";
import { useGetUsersBookmarks, useGetPostBookmarkCount } from "@api/query/BookmarksQueries";
import { useGetPostLikesByUser, useGetPostLikesCount } from "@api/query/LikeQueries";
import { useGetPost, useGetRepliesToPost } from "@api/query/PostQueries";
import QuotedPostCard from "@components/posts/QuotedPostCard";
import { useGetQuotesCount } from "@/api/query/QuoteRetweetQueries";

export default function PostViewerPage() {

    const {authUser} = useAuth();
    const navigate = useNavigate();

    const [isQuoteRetweeting, setIsQuoteRetweeting] = useState<boolean>(false);
    const [isReplying, setIsReplying] = useState<boolean>(false);

    const [showPhotoViewer, setShowPhotoViewer] = useState<boolean>(false);
    const [selectedPhoto, setSelectedPhoto] = useState<string>("");
    const {ref: photoViewerRef} = useOutsideAlerter<HTMLDivElement>(undefined, setSelectedPhoto);
    
    const [showPostModal, setShowPostModal] = useState<boolean>(false);
    const {ref: postModalRef} = useOutsideAlerter<HTMLDivElement>(setShowPostModal, undefined);

    const { postId } = useParams<{ postId: string }>();
    const postIdNumber = Number.parseInt(postId!);
    const {data: postEntity } = useGetPost(postIdNumber);

    const originalPosterId = postEntity?.userId!;
    const {data : userEntity} = useGetUserInfoFromId(originalPosterId);
    const {data: postReplies, refetch: refetchPostReplies } = useGetRepliesToPost(postIdNumber);

    const userLikedPostsResult = useGetPostLikesByUser(authUser?.id!);
    const userHasLikedPost = hasUserLikedPost(userLikedPostsResult?.data?.data, postIdNumber);
    const {data: postLikesCount, refetch: refetchPostLikesCount} = useGetPostLikesCount(postIdNumber);
    const likesCount = postLikesCount ?? 0;

    const userBookmarkedPostsResult = useGetUsersBookmarks(authUser?.id!);
    const userHasBookmarkedPost = hasUserBookmarkedPost(userBookmarkedPostsResult?.data?.data, authUser?.id!, postIdNumber);
    const {data: postBookmarksCount, refetch: refetchPostBookmarksCount} = useGetPostBookmarkCount(postIdNumber);
    const bookmarksCount = postBookmarksCount?.data ?? 0;

    const {data: postQuoteRetweetCount} = useGetQuotesCount(postIdNumber);
    const quotesCount = postQuoteRetweetCount?.data ?? 0;

    const { data: quotedPost, isLoading: isQuotePostLoading } = useGetPost(postEntity?.quotedPostId ?? 0);

    useEffect(() => {
        if (userEntity) {
            document.title = `${userEntity.data.name} on twitter post`;
        }
    }, [userEntity]);
    if (!postEntity) { return <div>no post found</div> }

    return (
        <div className="postViewerPageContainer">   
            <div className="postHeadingContainer">
                <div className="arrowLeftPostViewerHeaderContainer">
                    <ArrowLeft className="arrowLeftPostViewerHeader" size={20}
                        onClick={() => {
                            if (window.history.length > 1) {
                                navigate(-1); 
                            } else {
                                navigate('/home');
                            }
                        }}
                    />
                </div>
                <span className="postHeaderHeadingSpan">Post</span>
            </div>
            <div className="postDetailsContainer">
                <div className="postPosterPhotoNameContainer">
                    <div className="postViewerProfilePhotoContainer" onClick={()=> {userEntity && leadUserToProfilePage(navigate, userEntity?.data.username)}}>
                        <img src={userEntity?.data.profilePhoto} className="postViewerProfilePhoto"/>
                    </div>
                    <div className="postPosterNameContainer" onClick={()=> {userEntity && leadUserToProfilePage(navigate, userEntity?.data.username)}}>
                        <span className="postPosterUserName">{userEntity?.data.name}</span>
                        <span className="postPosterUsername">@{userEntity?.data.username}</span>
                    </div>
                    {
                        postEntity.replyToPostId && (
                            <button className="viewParentPostButton" onClick={()=> {
                                navigate(`/post/${postEntity.replyToPostId}`)
                            }}>View Parent Post</button>
                        )
                    }
                </div>
                <div className="postViewerTextContainer">
                    <MentionParser text={postEntity.postText!} />
                </div>
                <PostMediaDisplayer postEntity={postEntity} 
                    setSelectedPhoto={setSelectedPhoto} 
                />
                {(quotedPost) && postEntity.quotedPostId !==null ? (
                    <div className='quotedPostContainer'>
                        <QuotedPostCard
                            userId={quotedPost.userId}
                            postEntity={quotedPost}
                        />
                    </div>
                ) : isQuotePostLoading ? (
                    <div>Loading quoted post...</div>
                ) : null
                }
                <div className="postViewerDateTimeContainer">
                    {parseDate(postEntity.createdAt)}
                </div>
                <div className='postViewerAllIconContainer'>
                    <div className='iconContainer'>
                        <MessageCircle size={20} className='messageCircleIcon' onClick={()=> {
                        setIsReplying(true);
                        setShowPostModal(true);
                    }}/>
                        <span className='messageIconNumberSpan'>{postReplies?.length}</span>
                    </div>
                    <div className='iconContainer' onClick={()=> {
                        setIsQuoteRetweeting(true);
                        setShowPostModal(true);
                    }}
                    onContextMenu={(e)=> {
                        e.preventDefault();
                        navigate(`/post/${postIdNumber}/quotePosts`)
                    }}
                    >
                        <Repeat2 size={20} className='retweetCircleIcon'/>
                        <span className='retweetIconNumberSpan'>{quotesCount}</span>
                    </div>

                    <div className='iconContainer' 
                        onClick={()=> {authUser && addRemoveLike(postEntity, authUser, 
                                    userHasLikedPost, refetchPostLikesCount, userLikedPostsResult)}}>
                        {
                            userHasLikedPost ? (
                            <HeartIconSolid className="likeCircleIcon" color='#ff00eaff'/>
                        ) : (
                            <HeartIconOutline className="likeCircleIcon"/>)
                        }
                        <span className='likeIconNumberSpan'>{likesCount}</span>
                    </div>
                    <div className='iconContainer'
                    onClick={()=> {authUser && addRemoveBookmark(postEntity, authUser, 
                        userHasBookmarkedPost, refetchPostBookmarksCount, userBookmarkedPostsResult)}}
                    >
                        {
                            userHasBookmarkedPost ? (
                                <BookmarkIconSolid className='bookmarkCircleIcon' color='#006effff'/>
                            ): (
                                <BookmarkIconOutline className='bookmarkCircleIcon'/>
                            )
                        }
                        <span className='bookmarkIconNumberSpan'>{bookmarksCount}</span>
                    </div>
                </div>

            </div>
            <PostingArea userInfo={authUser} replyingToPostId={postEntity.postId}/>
            {
                postReplies?.map((postReply: PostEntity) => (
                    <PostCard userId={postReply.userId} postEntity={postReply}
                    userLikedPostsResult={userLikedPostsResult}
                    refetch={refetchPostReplies}
                    key={postReply.postId} 
                    userBookmarkedPostsResult={userBookmarkedPostsResult}                    
                />
                ))
            }
            {
                selectedPhoto!="" && (
                    <PhotoViewer 
                        refer={photoViewerRef}
                        selectedPhoto={selectedPhoto} 
                        setSelectedPhoto={setSelectedPhoto}
                        isVisible={showPhotoViewer}
                        setVisibilty={setShowPhotoViewer}
                    />
                )
            }
            {
                authUser && showPostModal && (
                    <PostModal userInfo={authUser} 
                        isVisible={showPostModal}
                        setIsVisible={setShowPostModal}
                        refer={postModalRef}
                        parentPostId={postEntity.postId}
                        parentUserName={userEntity?.data.username}

                        doingQuoteRetweet={isQuoteRetweeting}
                        doingReply={isReplying}

                        setIsQuoteRetweeting={setIsQuoteRetweeting}
                        setIsReplying={setIsReplying}
                    />
                )
            }
        </div>
    )
}