import axios from 'axios';
import  { API_URL } from '@constants/MiscConstants';
import { getAuthHeader } from '@methods/GetHeader';

const NotificationServiceEndpoint = "notification-service";
const notificationsEndpoint = "notifications";
const getAllNotificationsByUserEndpoint = "getAllNotificationsByUser";
const getUnreadNotificationsCountEndpoint = "getUnreadNotificationsCount";
const markNotificationAsReadEndpoint = "markNotificationAsRead";
const deleteNotificationEndpoint = "deleteNotification";

export async function getUsersNotifications(userId: number) {
    return await axios.get(`${API_URL}/${NotificationServiceEndpoint}/${notificationsEndpoint}/${getAllNotificationsByUserEndpoint}`, {
        params: {userId},
        ...getAuthHeader()
    });
}

export async function getUnreadNotificationsCount(userId: number){
    return await axios.get(`${API_URL}/${NotificationServiceEndpoint}/${notificationsEndpoint}/${getUnreadNotificationsCountEndpoint}`, {
        params: {userId},
        ...getAuthHeader()
    });
}

export async function markNotificationAsRead(notificationId: number) {
    return await axios.post(
        `${API_URL}/${NotificationServiceEndpoint}/${notificationsEndpoint}/${markNotificationAsReadEndpoint}`,
        {},
        {
            params: { notificationId }, ...getAuthHeader()
        }
    );
}

export async function deleteNotification(notificationId: number) {
    return await axios.post(
        `${API_URL}/${NotificationServiceEndpoint}/${notificationsEndpoint}/${deleteNotificationEndpoint}`,
        {}, 
        {
            params: { notificationId },
            headers: { ...getAuthHeader().headers }
        }
    );
}
