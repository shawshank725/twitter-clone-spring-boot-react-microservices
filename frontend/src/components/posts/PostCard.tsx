import '@styles/components-styles/posts/PostContainer.css';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import PhotoViewer from '@components/PhotoViewer';
import { EllipsisVertical, MessageCircle, Repeat2 } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import useOutsideAlerter from '@hooks/useOutsideAlerter';
import type { PostEntity } from '@/types/Posts/PostEntity';
import { type UseQueryResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { AxiosResponse } from 'axios';

import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { useGetUserInfoFromId } from '@/api/query/UserQueries';
import { addRemoveBookmark, addRemoveLike, deletePost, hasUserBookmarkedPost, hasUserLikedPost } from '@methods/PostInformationMethods';
import PostMediaDisplayer from '@/components/posts/PostMediaDisplayer';
import PostModal from '@/components/posts/PostModal';
import MentionParser from '@methods/ParseText';
import QuotedPostCard from '@/components/posts/QuotedPostCard';
import { useGetPostLikesCount } from '@/api/query/LikeQueries';
import { useGetPostBookmarkCount } from '@/api/query/BookmarksQueries';
import { useGetPost, useGetRepliesToPost } from '@/api/query/PostQueries';
import { useGetQuotesCount } from '@/api/query/QuoteRetweetQueries';

type PostEntityProp = {
    userId: number;
    postEntity: PostEntity;
    refetch?: () => void;
    userLikedPostsResult?: UseQueryResult<AxiosResponse<any, any>, Error>;
    userBookmarkedPostsResult?: UseQueryResult<AxiosResponse<any, any>, Error>;
}

export default function PostCard({ userId, postEntity,
    refetch, userLikedPostsResult,
    userBookmarkedPostsResult,
}: PostEntityProp) {

    const { authUser } = useAuth();
    const loggedInUser = authUser?.username;
    const { data: user, isLoading: isUserProfileLoading } = useGetUserInfoFromId(userId);
    const userEntity = user?.data!;

    const quotedPostId = postEntity.quotedPostId ?? 0;
    const { data: quotedPost, isLoading: isQuotePostLoading } = useGetPost(quotedPostId);

    const [showPostModal, setShowPostModal] = useState<boolean>(false);
    const { ref: postModalRef } = useOutsideAlerter<HTMLDivElement>(setShowPostModal, undefined);

    const timeAgo = formatDistanceToNow(new Date(postEntity.createdAt), { addSuffix: true });

    const [showPhotoViewer, setShowPhotoViewer] = useState<boolean>(false);
    const [selectedPhoto, setSelectedPhoto] = useState<string>("");

    const [showMoreSettings, setShowMoreSettings] = useState<boolean>(false);

    const { ref: settingsRef } = useOutsideAlerter<HTMLDivElement>(setShowMoreSettings);
    const { ref: photoViewerRef } = useOutsideAlerter<HTMLDivElement>(undefined, setSelectedPhoto);

    // LIKE THINGS HERE
    const userHasLikedPost = hasUserLikedPost(userLikedPostsResult?.data?.data, postEntity.postId);
    const { data: postLikesCount, refetch: refetchPostLikesCount } = useGetPostLikesCount(postEntity.postId);
    const likesCount = postLikesCount ?? 0;

    // BOOKMARK THINGS HERE
    const userHasBookmarkedPost = hasUserBookmarkedPost(userBookmarkedPostsResult?.data?.data, authUser?.id!, postEntity.postId);
    const { data: postBookmarksCount, refetch: refetchPostBookmarksCount } = useGetPostBookmarkCount(postEntity.postId);
    const bookmarksCount = postBookmarksCount?.data ?? 0;

    const {data: postQuoteRetweetCount} = useGetQuotesCount(postEntity.postId);
    const quotesCount = postQuoteRetweetCount?.data ?? 0;

    // GETTING REPLIES TO A POST COUNT
    const { data: postReplies } = useGetRepliesToPost(postEntity.postId);
    const navigate = useNavigate();

    const [isQuoteRetweeting, setIsQuoteRetweeting] = useState<boolean>(false);
    const [isReplying, setIsReplying] = useState<boolean>(false);

    if (isUserProfileLoading) {
        return <div>Loading post ... </div>
    }

    return (
        <div className="postCardContainer" >
            <div className="postCardProfilePhotoContainer">
                <img src={userEntity.profilePhoto} className="postCardProfilePhoto" 
                    onClick={(e: React.MouseEvent)=> {
                        e.stopPropagation(); 
                        navigate(`/${userEntity.username}`);
                    }}
                />
            </div>
            <div className='postContentContainer'>
                <div className="postHeaderContainer">
                    <div className="postUserInfoContainer"
                    onClick={(e: React.MouseEvent)=> {
                        e.stopPropagation(); 
                        navigate(`/${userEntity.username}`);
                    }}>
                        <span className="postUserName">{userEntity.name}</span>
                        <span className="postUsername">@{userEntity.username}</span>
                    </div>
                    <div className='rightSideHeaderContainer'>
                        <div className='timeContainer'>
                            {timeAgo}
                        </div>

                        <div>
                            <div className='moreSettingsContainer' onClick={() => {
                                if (showMoreSettings == true) {
                                    setShowMoreSettings(false);
                                }
                                else {
                                    setShowMoreSettings(true);
                                }
                            }}>
                                <EllipsisVertical size={20} />
                            </div>
                            {
                                showMoreSettings && (
                                    <div className='moreSettingsDialogBox' ref={settingsRef}>
                                        <div className='moreSettingsOption'>Share post</div>
                                        <div className='moreSettingsOption'>Report post</div>
                                        {
                                            loggedInUser === userEntity.username && (
                                                <div className='moreSettingsOption' onClick={() => {
                                                    deletePost(postEntity.postId, userEntity, setShowMoreSettings, refetch)
                                                }}>
                                                    Delete Post
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>

                    </div>
                </div>

                <div className='postTextContainer' onClick={() => { navigate(`/post/${postEntity.postId}`); }}>
                    <MentionParser text={postEntity.postText!} />
                </div>

                <PostMediaDisplayer postEntity={postEntity}
                    setSelectedPhoto={setSelectedPhoto}
                />

                {postEntity.postType === "QUOTE" && postEntity.quotedPostId !== null && (
                    quotedPost ? (
                        <div className='quotedPostContainer'>
                        <QuotedPostCard
                            userId={quotedPost.userId}
                            postEntity={quotedPost}
                        />
                        </div>
                    ) : isQuotePostLoading ? (
                        <div>Loading quoted post...</div>
                    ) : (
                        <p style={{ textAlign: 'center', color: 'grey', fontStyle: 'italic' }}>
                        This post is unavailable.
                        </p>
                    )
                )}

                <div className='postAllIconContainer'>
                    <div className='iconContainer' onClick={() => {
                        setIsReplying(true);
                        setShowPostModal(true);
                    }}>
                        <MessageCircle size={20} className='messageCircleIcon' />
                        <span className='messageIconNumberSpan'>{postReplies?.length}</span>
                    </div>

                    <div className='iconContainer'
                        onClick={() => {
                            setIsQuoteRetweeting(true);
                            setShowPostModal(true);
                        }}
                        onContextMenu={(e)=> {
                        e.preventDefault();
                        navigate(`/post/${postEntity.postId}/quotePosts`)
                    }}
                    >
                        <Repeat2 size={20} className='retweetCircleIcon' />
                        <span className='retweetIconNumberSpan'>{quotesCount}</span>
                    </div>

                    <div className='iconContainer'
                        onClick={() => {
                            authUser && userLikedPostsResult && addRemoveLike(postEntity, authUser,
                                userHasLikedPost, refetchPostLikesCount, userLikedPostsResult)
                        }}>
                        {
                            userHasLikedPost ? (
                                <HeartIconSolid className="likeCircleIcon" color='#ff00eaff' />
                            ) : (
                                <HeartIconOutline className="likeCircleIcon" />
                            )
                        }
                        <span className='likeIconNumberSpan'>{likesCount}</span>
                    </div>
                    <div className='iconContainer'
                        onClick={() => {
                            authUser && userBookmarkedPostsResult && addRemoveBookmark(postEntity, authUser,
                                userHasBookmarkedPost, refetchPostBookmarksCount, userBookmarkedPostsResult)
                        }}
                    >
                        {
                            userHasBookmarkedPost ? (
                                <BookmarkIconSolid className='bookmarkCircleIcon' color='#006effff' />
                            ) : (
                                <BookmarkIconOutline className='bookmarkCircleIcon' />
                            )
                        }
                        <span className='bookmarkIconNumberSpan'>{bookmarksCount}</span>
                    </div>
                </div>
            </div>
            {
                selectedPhoto != "" && (
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
                    <PostModal
                        userInfo={authUser}
                        isVisible={showPostModal}
                        setIsVisible={setShowPostModal}
                        refer={postModalRef}

                        parentUserName={userEntity?.username}
                        parentPostId={postEntity.postId}
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