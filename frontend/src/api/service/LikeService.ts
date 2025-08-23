import axios, { type AxiosResponse } from 'axios';
import  { API_URL } from '@constants/MiscConstants';
import { getAuthHeader } from '@methods/GetHeader';
import type { NewLikeEntity } from '@/types/Likes/NewLikeEntity';
import type { LikeEntity } from '@/types/Likes/LikeEntity';

const PostingServiceEndpoint = "posting-service";
const LikeEndpoint = "like";
const addLikeEndpoint = "addLike";
const getLikesByPostIdEndpoint = "getLikesByPostId";
const deleteLikeEntityEndpoint = "deleteLikeEntity";
const getLikeEntityByUserIdEndpoint = "getLikeEntityByUserId";
const getPostLikesCountEndpoint = "getPostLikesCount";
const getLikedPostsEndpoint = "getLikedPosts";

export async function addLike(newLikeEntity: NewLikeEntity){
    return await axios.post(
        `${API_URL}/${PostingServiceEndpoint}/${LikeEndpoint}/${addLikeEndpoint}`, 
        newLikeEntity,
        getAuthHeader()
    )
}

export async function getLikesByPostId(postId: number) : Promise<AxiosResponse<LikeEntity[]>>{
    return await axios.get(
        `${API_URL}/${PostingServiceEndpoint}/${LikeEndpoint}/${getLikesByPostIdEndpoint}`, 
        {
            ...getAuthHeader(),
            params: { postId }
        }
    );
}

export async function deleteLikeEntity(likedPostId: number, likedByUserId: number){
    return await axios.post(
        `${API_URL}/${PostingServiceEndpoint}/${LikeEndpoint}/${deleteLikeEntityEndpoint}`, 
        null, 
        {
            ...getAuthHeader(),
            params: { likedPostId, likedByUserId }
        }
    );
}

export async function getLikeEntityByUserId(userId: number){
    return await axios.get(
        `${API_URL}/${PostingServiceEndpoint}/${LikeEndpoint}/${getLikeEntityByUserIdEndpoint}`, 
        {
            ...getAuthHeader(),
            params: { userId }
        }
    );
}

// GETTING POST LIKES COUNT
export async function getPostLikesCount(postId: number){
    return await axios.get(
        `${API_URL}/${PostingServiceEndpoint}/${LikeEndpoint}/${getPostLikesCountEndpoint}`, 
        {
            ...getAuthHeader(),
            params: { postId }
        }
    );
}


// GETTING LIKED POSTS OF A USER 
export async function getLikedPosts(userId: number ){
    return await axios.get(
        `${API_URL}/${PostingServiceEndpoint}/${LikeEndpoint}/${getLikedPostsEndpoint}`, 
        {
            ...getAuthHeader(),
            params: { userId }
        }
    );
}