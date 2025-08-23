import { useQuery } from "@tanstack/react-query"
import { getUnreadNotificationsCount, getUsersNotifications } from "@/api/service/NotificationService";



export const useGetUserNotifications = (userId : number ) => {
    return useQuery({
        queryKey: ["user-notifications", userId],
        queryFn: async () => {
            const result = await getUsersNotifications(userId);
            if (!result?.data){
                throw new Error("COULD NOT FIND Notifications");
            }
            return result.data;
        },
        staleTime: 0,
        enabled: !!userId
    })
}

export const useGetUnreadNotificationsCount = (userId: number) => {
    return useQuery({
        queryKey: ["user-unread-notifications-count", userId],
        queryFn: async () => {
            const result = await getUnreadNotificationsCount(userId);
            if (!result?.data){
                throw new Error("COULD NOT GET NOTIFICATIONS COUNT");
            }
            return result.data;
        },
        staleTime: 0,
        enabled: !!userId
    })
}