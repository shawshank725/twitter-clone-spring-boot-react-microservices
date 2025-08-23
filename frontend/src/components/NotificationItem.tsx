import { useNavigate } from "react-router-dom";
import { useGetUserInfoFromId } from "@/api/query/UserQueries";
import "@styles/components-styles/NotificationItem.css";
import type { NotificationEntity } from "@/types/Notifications/NotificationEntity";
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { UserPlusIcon as UserSolid } from '@heroicons/react/24/solid';
import { AtSymbolIcon as AtSymbolSolid } from '@heroicons/react/24/solid';
import { ChatBubbleBottomCenterIcon as ChatBubbleSolid } from '@heroicons/react/24/solid';
import { ArrowPathRoundedSquareIcon as QuoteRetweetSolid } from '@heroicons/react/24/solid';
import { forwardRef } from "react";
import { Trash2 } from "lucide-react";
import { deleteNotification } from "@/api/service/NotificationService";
import { queryClient } from "@/main";

type NotificationProp = {
    notification: NotificationEntity;
} & React.HTMLAttributes<HTMLDivElement>;

// export default function NotificationItem ({notification}: NotificationProp) {
const NotificationItem = forwardRef<HTMLDivElement, NotificationProp>(
    ({ notification, ...rest }, ref) => {
        const triggeredByUser = useGetUserInfoFromId(notification.triggeredByUserId);
        const navigate = useNavigate();
        const userId: number = notification.notifiedUserId;
        return (
            <div
                ref={ref}
                className={`notificationItemContainer${notification.notificationStatus == "UNREAD" ? "Unread" : "Read"}`}
                onClick={() => {
                    if (notification.notificationType != "FOLLOW") {
                        navigate(`/post/${notification.postId}`);
                    }
                }}
                {...rest}
            >
                <div className="notificationIconInfoContainer">
                    <div className="notificationIconContainer">
                        {
                            notification.notificationType == "LIKE" && (
                                <HeartIconSolid color="#ff00ddff" />
                            )
                        }
                        {
                            notification.notificationType == "MENTION" && (
                                <AtSymbolSolid color="#000000ff" />
                            )
                        }
                        {
                            notification.notificationType == "FOLLOW" && (
                                <UserSolid color="#0077ffff" />
                            )
                        }
                        {
                            notification.notificationType == "REPLY" && (
                                <ChatBubbleSolid color="#0b8000ff" />
                            )
                        }
                        {
                            notification.notificationType == "QUOTE" && (
                                <QuoteRetweetSolid color="#fbff00ff" />
                            )
                        }
                    </div>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", columnGap: "10px" }}>
                            <img
                                src={triggeredByUser.data?.data.profilePhoto}
                                onClick={(e: React.MouseEvent<HTMLImageElement>) => {
                                    e.stopPropagation();
                                    navigate(`/${triggeredByUser.data?.data.username}`)
                                }}
                                className="notificationTriggeringUserProfilePhoto"
                            />

                            <div className="notificationMessageContainer">
                                <span className="triggeredByUserUsername"
                                    onClick={(e: React.MouseEvent<HTMLImageElement>) => {
                                        e.stopPropagation();
                                        navigate(`/${triggeredByUser.data?.data.username}`)
                                    }}
                                >{triggeredByUser.data?.data.name}</span>
                                {
                                    notification.notificationType == "LIKE" && (
                                        <span> liked your post.</span>
                                    )
                                }
                                {
                                    notification.notificationType == "FOLLOW" && (
                                        <span> follows you now!</span>
                                    )
                                }
                                {
                                    notification.notificationType == "MENTION" && (
                                        <span> mentioned you in a post!</span>
                                    )
                                }
                                {
                                    notification.notificationType == "REPLY" && (
                                        <span> replied to your post!</span>
                                    )
                                }
                                {
                                    notification.notificationType == "QUOTE" && (
                                        <span> quote retweeted your post!</span>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="notificationToolsContainer">
                    <div
                        onClick={async (e: React.MouseEvent<HTMLImageElement>) => {
                            e.stopPropagation();
                            queryClient.setQueryData<NotificationEntity[]>(["user-notifications", userId], oldData =>
                                oldData ? oldData.filter(n => n.notificationId !== notification.notificationId) : []
                            );
                            await deleteNotification(notification.notificationId);
                            await queryClient.invalidateQueries({ queryKey: ["user-unread-notifications-count", userId] });
                        }}>
                        <Trash2 color="#a19d9dff" size={20} />
                    </div>
                </div>
            </div>
        )
    }
);

export default NotificationItem;