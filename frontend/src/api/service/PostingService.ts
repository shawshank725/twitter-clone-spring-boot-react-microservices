import axios, { type AxiosResponse } from 'axios';
import type { NewPostEntity, PostEntity } from '@/types/Posts/PostEntity';
import  { API_URL } from '@constants/MiscConstants';
import { getAuthHeader } from '@methods/GetHeader';

const PostingService = "posting-service";
const AddPostEndpoint = "addPost";
const PostEndpoint = "post";
const GetAllUsersPostsEndpoint = "getUsersPosts";
const DeletePostEndpoint = "deletePost";
const getPostByPostIdEndpoint = "getPostByPostId";
const getRepliesToPostEndpoint = "getRepliesToPost";
const deletePostsOfUserEndpoint = "deletePostsOfUser";

export async function saveNewPost(newPostEntity: NewPostEntity){
    return await axios.post(`${API_URL}/${PostingService}/${PostEndpoint}/${AddPostEndpoint}`, 
        newPostEntity ,
        getAuthHeader()
    );
}


export async function getUsersPost(userId: number) {
    return await axios.get(`${API_URL}/${PostingService}/${PostEndpoint}/${GetAllUsersPostsEndpoint}`, {
        params: {userId},
        ...getAuthHeader()
    });
}

export async function deletePostByPostId(postId: number){
    return await axios.post(`${API_URL}/${PostingService}/${PostEndpoint}/${DeletePostEndpoint}?postId=${postId}`,
        {}, getAuthHeader()
    )
}


export async function getPostByPostId(postId: number) : Promise<AxiosResponse<PostEntity>>{
    return await axios.get(`${API_URL}/${PostingService}/${PostEndpoint}/${getPostByPostIdEndpoint}`, {
        params: {postId},
        ...getAuthHeader()
    });
}

export async function getRepliesToPost(postId: number): Promise<AxiosResponse<PostEntity[]>>{
    return await axios.get(`${API_URL}/${PostingService}/${PostEndpoint}/${getRepliesToPostEndpoint}`, {
        params: {postId},
        ...getAuthHeader()
    });
}

export async function deleteAllUsersPosts(userId: number) {
    return await axios.post(`${API_URL}/${PostingService}/${PostEndpoint}/${deletePostsOfUserEndpoint}?userId=${userId}`,
        {}, getAuthHeader()
    )
}