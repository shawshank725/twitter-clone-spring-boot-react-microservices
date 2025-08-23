import { useQuery } from "@tanstack/react-query"
import { getUserByUserId, getUserByUsername } from "@/api/service/UserService"
import { getUsersConnection } from "@/api/service/ConnectionService";

// GETTING USER INFORMATION FROM THE USERNAME
export const useGetUserInfoFromUsername = (username: string) => {
    return useQuery({
        queryKey: ["users", username],
        queryFn: async () => {
            const result = await getUserByUsername(username);
            if (!result?.data){
                throw new Error("UNABLE TO FETCH USER DETAILS");
            }
            return result;
        }
    })
}

// GETTING USERINFO FROM THE USER ID 
export const useGetUserInfoFromId = (userId: number) => {
    return useQuery({
        queryKey: ["users", userId],
        queryFn: async () => {
            const result = await getUserByUserId(userId);
            if (!result?.data){
                throw new Error("UNABLE TO FETCH USER DETAILS");
            }
            return result;
        }
    })
}


// GETTING FOLLOWER FOLLOWING DTO OF THE USER - GET HIS CONNECTIONS 
export const useGetUserConnections = (userId: number) => {
    return useQuery({
        queryKey: ["connections", userId],
        queryFn: async () => {
            const result =  await getUsersConnection(userId);
            if (!result?.data){
                throw new Error("COULD NOT FIND USER POSTS");
            }
            return result;
        },
        staleTime: 0,
        enabled: !!userId
    })
}

