import axios, { type AxiosResponse } from 'axios';
import  { API_URL } from '@constants/MiscConstants';
import { getAuthHeader } from '@methods/GetHeader';
import type { NewBookmarkEntity } from '@/types/Bookmarks/NewBookmarkEntity';
import type { BookmarkEntity } from '@/types/Bookmarks/BookmarkEntity';
import type { PostEntity } from '@/types/Posts/PostEntity';

const PostingServiceEndpoint = "posting-service";
const BookmarkEndpoint = "bookmark";
const addBookmarkEndpoint = "addBookmark";
const removeBookmarkEntityEndpoint = "removeBookmark";
const getAllBookmarksByUserIdOrderByBookmarkedAtEndpoint = "getAllBookmarksByUserId";
const getPostBookmarkCountEndpoint = "getPostBookmarkCount";
const getPostEntityBasedOnBookmarksEndpoint = "getPostEntityBasedOnBookmarks";

export async function addBookmark(newBookmarkEntity: NewBookmarkEntity): Promise<AxiosResponse<BookmarkEntity>>{
    return await axios.post(
        `${API_URL}/${PostingServiceEndpoint}/${BookmarkEndpoint}/${addBookmarkEndpoint}`, 
        newBookmarkEntity,
        getAuthHeader()
    )
}

export async function removeBookmarkEntity(bookmarkedPostId: number, bookmarkedByUserId: number) {
    return await axios.post(
        `${API_URL}/${PostingServiceEndpoint}/${BookmarkEndpoint}/${removeBookmarkEntityEndpoint}`, 
        null, 
        {
            ...getAuthHeader(),
            params: { bookmarkedPostId, bookmarkedByUserId }
        }
    );
}

export async function getAllBookmarksByUserId(userId: number) : Promise<AxiosResponse<BookmarkEntity[]>>{
    return await axios.get(
        `${API_URL}/${PostingServiceEndpoint}/${BookmarkEndpoint}/${getAllBookmarksByUserIdOrderByBookmarkedAtEndpoint}`, 
        {
            ...getAuthHeader(),
            params: { userId }
        }
    );

}


export async function getPostBookmarkCount(postId: number) : Promise<AxiosResponse<number>>{
    return await axios.get(
        `${API_URL}/${PostingServiceEndpoint}/${BookmarkEndpoint}/${getPostBookmarkCountEndpoint}`, 
        {
            ...getAuthHeader(),
            params: { postId }
        }
    );
}

export async function getPostsFromBookmarks(userId: number): Promise<AxiosResponse<PostEntity[]>>{
    return await axios.get(
        `${API_URL}/${PostingServiceEndpoint}/${BookmarkEndpoint}/${getPostEntityBasedOnBookmarksEndpoint}`, 
        {
            ...getAuthHeader(),
            params: { userId }
        }
    );
}