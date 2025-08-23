import { useQuery } from "@tanstack/react-query"
import { getQuotedCount, getQuotedPosts } from "@api/service/QuoteRetweetService";

export const useGetQuotesCount = (postId: number) => {
    return useQuery({
        queryKey: ["quote-count", postId],
        queryFn: async () => {
            const result =  await getQuotedCount(postId);
            if (!result?.data){
                throw new Error("COULD NOT FIND POSTS QUOTE COUNT");
            }
            return result;
        },
        staleTime: 0,
        enabled: !!postId
    })
}


export const useGetQuotePosts = (postId: number) => {
    return useQuery({
        queryKey: ["quote-posts", postId],
        queryFn: async () => {
            const result =  await getQuotedPosts(postId);
            if (!result?.data){
                throw new Error("COULD NOT FIND QUOTE POSTS");
            }
            return result;
        },
        staleTime: 0,
        enabled: !!postId
    })
}

