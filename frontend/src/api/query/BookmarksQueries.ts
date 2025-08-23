import { useQuery } from "@tanstack/react-query";
import { getAllBookmarksByUserId, getPostBookmarkCount, getPostsFromBookmarks } from "@/api/service/BookmarkService";

// GETTING ALL THE BOOKMARKS OR A LIST OF BOOKMARKS OF A USER
export const useGetUsersBookmarks = (userId: number ) => {
    return useQuery({
        queryKey: ["bookmarks", userId],
        queryFn: async () => {
            const result = await getAllBookmarksByUserId(userId);
            if (!result?.data){
                throw new Error("COULD NOT FIND USER BOOKMARKS");
            }
            return result;
        },
        staleTime: 0,
        enabled: !!userId
    })
}

// GETTING A BOOKMARKS COUNT OF A POST BY POST ID
export const useGetPostBookmarkCount = (postId: number) => {
    return useQuery({
        queryKey: ["bookmarks-count", postId],
        queryFn: async () => {
            const result = await getPostBookmarkCount(postId);
            if (!result?.data){
                throw new Error("COULD NOT FIND POSTS BOOKMARKS COUNT");
            }
            return result;
        },
        staleTime: 0,
        enabled: !!postId
    })
}


export const useGetBookmarkPosts = (userId: number) => {
    return useQuery({
        queryKey: ["bookmark-posts", userId],
        queryFn: async () => {
            const result = await getPostsFromBookmarks(userId);
            if (!result?.data){
                throw new Error("COULD NOT FIND POSTS");
            }
            return result.data;
        },
        staleTime: 0,
        enabled: !!userId
    })
}
