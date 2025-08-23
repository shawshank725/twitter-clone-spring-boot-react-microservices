import { useQuery } from "@tanstack/react-query"
import { getLikedPosts, getLikeEntityByUserId, getPostLikesCount } from "@/api/service/LikeService";


// GETTING THE LIKE COUNT OF A POST BY POST ID 
export const useGetPostLikesCount = (postId: number) => {
    return useQuery({
        queryKey: ["post-likes-count", postId],
        queryFn: async () => {
            const result = await getPostLikesCount(postId);
            if (!result?.data){
                throw new Error("COULD NOT FIND POSTS LIKE COUNT");
            }
            return result.data;
        },
        staleTime: 0,
        enabled: !!postId,
    })
}

// GETTING A LIST OF POSTS LIKED BY THE USER
export const useGetPostLikesByUser = (userId: number) => {
    return useQuery({
        queryKey: ["posts-liked-by-user", userId],
        queryFn: async () => {
            const result = await getLikeEntityByUserId(userId);
            if (!result?.data){
                throw new Error("COULD NOT FIND USER POSTS");
            }
            return result;
        },
        staleTime: 0,
        enabled: !!userId
    })
}


export const useGetLikedPosts = (userId: number) => {
    return useQuery({
        queryKey: ["liked-posts-entities", userId],
        queryFn: async () => {
            const result = await getLikedPosts(userId);
            if (!result?.data){
                throw new Error("COULD NOT FIND POSTS BOOKMARKS COUNT");
            }
            return result;
        },
        staleTime: 0,
        enabled: !!userId
    })
}