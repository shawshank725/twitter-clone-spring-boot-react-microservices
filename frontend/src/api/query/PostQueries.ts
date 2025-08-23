import { useQuery } from "@tanstack/react-query"
import { getPostByPostId, getRepliesToPost, getUsersPost } from "@/api/service/PostingService";


// GETTING ALL THE POSTS OF THE USER BY THEIR USER ID
export const useGetPosts = (userId: number) => {
    return useQuery({
        queryKey: ["posts", userId],
        queryFn: async () => {
            const result =  await getUsersPost(userId);
            if (!result?.data){
                throw new Error("COULD NOT FIND USER POSTS");
            }
            return result;
        },
        staleTime: 0,
        enabled: !!userId
    })
}


export const useGetPost = (postId: number) => {
    return useQuery({
        queryKey: ["post", postId],
        queryFn: async () => {
            const result = await getPostByPostId(postId);
            if (!result?.data){
                throw new Error("COULD NOT FIND POSTS BOOKMARKS COUNT");
            }
            return result.data;
        },
        staleTime: 0,
        enabled: !!postId
    })
}

export const useGetRepliesToPost = (postId: number) => {
    return useQuery({
        queryKey: ["post-replies", postId],
        queryFn: async () => {
            const result = await getRepliesToPost(postId);
            if (!result?.data){
                throw new Error("COULD NOT FIND POSTS BOOKMARKS COUNT");
            }
            return result.data;
        },
        staleTime: 0,
        enabled: postId !==null
    })
}