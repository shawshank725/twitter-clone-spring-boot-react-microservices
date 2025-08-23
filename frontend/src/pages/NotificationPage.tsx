import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import "@/styles/pages-styles/NotificationsPage.css";
import { ArrowLeft } from "lucide-react";
import { useGetUserNotifications } from "@/api/query/NotificationQueries";
import NotificationItem from "@components/NotificationItem";
import type { NotificationEntity } from "@/types/Notifications/NotificationEntity";
import { markNotificationAsRead } from "@/api/service/NotificationService";
import { useRef, useEffect } from "react";
import { queryClient } from "@/main";
import ErrorMessage from "@components/ErrorMessage";

export default function NotificationPage() {
    const { authUser } = useAuth();
    const navigate = useNavigate();
    const userId = authUser?.id ?? 0;
    const { data: userNotifications, isLoading: isLoadingNotifications } = useGetUserNotifications(userId);

    useEffect(() => {
        if (authUser) {
            document.title = `Your notifications`;
        }
    }, [authUser]);

    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const timeouts = useRef<Record<number, NodeJS.Timeout>>({});

    useEffect(() => {
        if (!userNotifications) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = Number(entry.target.getAttribute("data-id"));
                    if (entry.isIntersecting) {
                        if (!timeouts.current[id]) {
                            timeouts.current[id] = setTimeout(async() => {
                                await markNotificationAsRead(id);
                                await queryClient.invalidateQueries({queryKey: ["user-notifications", userId]});
                                await queryClient.invalidateQueries({queryKey: ["user-unread-notifications-count", userId]});
                            }, 3000);
                        }
                    } else {
                        if (timeouts.current[id]) {
                            clearTimeout(timeouts.current[id]);
                            delete timeouts.current[id];
                        }
                    }
                });
            },
            { threshold: 0.5 } 
        );

        itemRefs.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => {
            observer.disconnect();
            Object.values(timeouts.current).forEach(clearTimeout);
        };
    }, [userNotifications]);


    return (
        <div className="notificationsPageContainer">
            <div className="notificationHeadingContainer">
                <div className="arrowLeftNotificationViewerHeaderContainer">
                    <ArrowLeft
                        className="arrowLeftNotificationViewerHeader"
                        size={20}
                        onClick={() => {
                            if (window.history.length > 1) {
                                navigate(-1);
                            } else {
                                navigate('/home');
                            }
                        }}
                    />
                </div>
                <span className="notificationHeaderHeadingSpan">Notifications</span>
            </div>
            {isLoadingNotifications ? (
                <p>Loading...</p>
            ) : userNotifications && userNotifications.length > 0 ? (
                userNotifications.map((notification: NotificationEntity, index: number) => (
                    <NotificationItem
                        ref={(el) => {
                        if (el) itemRefs.current[index] = el;
                        }}
                        key={notification.notificationId}
                        notification={notification}
                        data-id={notification.notificationId} 
                    />
                ))
            ) : (
                <ErrorMessage title="No notifications." message="If you receive any notifications you'll find 'em here."/>
            )
            }
        </div>

    )
}