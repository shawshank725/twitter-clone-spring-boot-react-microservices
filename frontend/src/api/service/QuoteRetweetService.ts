import axios, { type AxiosResponse } from 'axios';
import  { API_URL } from '@constants/MiscConstants';
import { getAuthHeader } from '@methods/GetHeader';
import type { PostEntity } from '@/types/Posts/PostEntity';


const PostingService = "posting-service";
const quotesEndpoint = "quote";
const getQuotedCountEndpoint = "getQuotedCount";
const getQuotedPostsEndpoint = "getQuotedPosts";

// to get count 
export async function getQuotedCount(postId: number): Promise<AxiosResponse<number>>{
    return await axios.get(`${API_URL}/${PostingService}/${quotesEndpoint}/${getQuotedCountEndpoint}`, {
        params: {postId},
        ...getAuthHeader()
    });
}

// to get the posts (quote posts)
export async function getQuotedPosts(postId: number): Promise<AxiosResponse<PostEntity[]>>{
    return await axios.get(`${API_URL}/${PostingService}/${quotesEndpoint}/${getQuotedPostsEndpoint}`, {
        params: {postId},
        ...getAuthHeader()
    });
}