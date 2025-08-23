import '@styles/components-styles/posts/PostContainer.css';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import PhotoViewer from '@/components/PhotoViewer';
import useOutsideAlerter from '@hooks/useOutsideAlerter';
import type { PostEntity } from '@/types/Posts/PostEntity';
import { useNavigate } from 'react-router-dom';
import PostMediaDisplayer from '@/components/posts/PostMediaDisplayer';
import MentionParser from '@methods/ParseText';
import { useGetUserInfoFromId } from '@/api/query/UserQueries';

type PostEntityProp = {
    userId: number;
    postEntity: PostEntity;
}

export default function QuotedPostCard ({ userId, postEntity}: PostEntityProp) {   
    const {data: poster} = useGetUserInfoFromId(postEntity.userId);
    const { data: user , isLoading: isUserProfileLoading} = useGetUserInfoFromId(userId);
    const userEntity = user?.data!;

    const navigate = useNavigate();
    const timeAgo = formatDistanceToNow(new Date(postEntity.createdAt), { addSuffix: true });

    const [showPhotoViewer, setShowPhotoViewer] = useState<boolean>(false);
    const [selectedPhoto, setSelectedPhoto] = useState<string>("");

    const {ref: photoViewerRef} = useOutsideAlerter<HTMLDivElement>(undefined, setSelectedPhoto);

    if (isUserProfileLoading){
        return <div>Loading post ... </div>
    }

    return (
        <div className="postCardContainer" onClick={()=> {navigate(`/post/${postEntity.postId}`);}} >
            <div className="postCardProfilePhotoContainer">
                <img src={userEntity.profilePhoto} className="postCardProfilePhoto" 
                    onClick={(e: React.MouseEvent)=> {
                        e.stopPropagation(); 
                        navigate(`/${poster?.data.username}`);
                    }}/>
            </div>
            <div className='postContentContainer'>
                <div className="postHeaderContainer">
                    <div className="postUserInfoContainer" 
                    onClick={(e: React.MouseEvent)=> {
                        e.stopPropagation(); 
                        navigate(`/${poster?.data.username}`);
                    }}>
                        <span className="postUserName">{userEntity.name}</span>
                        <span className="postUsername">@{userEntity.username}</span>
                    </div>
                    <div className='rightSideHeaderContainer'>
                        <div className='timeContainer'>
                            {timeAgo}
                        </div>
                    </div>
                </div>
                
                <div className='postTextContainer' >
                    <MentionParser text={postEntity.postText!} />
                </div>
                
                <PostMediaDisplayer postEntity={postEntity} 
                    setSelectedPhoto={setSelectedPhoto} 
                />
            </div>
            {
                selectedPhoto !="" && (
                    <PhotoViewer 
                        refer={photoViewerRef}
                        selectedPhoto={selectedPhoto} 
                        setSelectedPhoto={setSelectedPhoto}
                        isVisible={showPhotoViewer}
                        setVisibilty={setShowPhotoViewer}
                    />
                )
            }            
        </div>
    )
}