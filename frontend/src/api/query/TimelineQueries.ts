import { useQuery } from "@tanstack/react-query";
import { generateFollowSuggestions, getSearchResult, getTimeline } from "../service/TimelineService";

export const useGenerateTimeline = (userId: number) => {
    return useQuery({
        queryKey: ["timeline", userId],
        queryFn: async () => {
            const result = await getTimeline(userId);
            if (!result?.data) {
                throw new Error("COULD NOT GET THE TIMELINE");
            }
            return result.data;
        },
        staleTime: 0,
        enabled: !!userId
    })
}

export const useGenerateFollowSuggestions = (userId: number) => {
    return useQuery({
        queryKey: ["follow-suggestions", userId],
        queryFn: async () => {
            const result = await generateFollowSuggestions(userId);
            if (!result?.data) {
                throw new Error("COULD NOT GET THE SUGGESTIONS FOR USER TO FOLLOW");
            }
            return result.data;
        },
        staleTime: 0,
        enabled: !!userId
    })
}

export const useGetSearchResults = (input:string) => {
    return useQuery({
        queryKey: ["search-result", input],
        queryFn: async () => {
            const result = await getSearchResult(input);
            if (!result?.data) {
                throw new Error("COULD NOT GET THE SEARCH RESULTS");
            }
            return result.data;
        },
        staleTime: 0,
        enabled: !!input
    })
}