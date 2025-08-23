export type NotificationEntity = {
    notificationId: number;
    notificationType: NotificationType; 
    notificationStatus: NotificationStatus; 
    notificationTime: string; 
    notifiedUserId: number;
    triggeredByUserId: number;
    postId: number;
};

export type NotificationType = "LIKE" | "REPLY" | "FOLLOW" | "QUOTE" | "MENTION";

export type NotificationStatus = "UNREAD" | "READ";
