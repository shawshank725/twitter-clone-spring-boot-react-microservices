import { toast } from "react-toastify";
import Stomp from "stompjs";
import type { NotificationEntity } from "@/types/Notifications/NotificationEntity";
import { getUserByUserId } from "@/api/service/UserService";
import { queryClient } from "@/main";

let socketClient: any = null;

export function connectSocket(onConnected?: () => void) {

  const socket = new WebSocket("ws://localhost:9999/ws");
  socketClient = Stomp.over(socket);

  socketClient.connect({},
    () => {
      console.log("Connected to WebSocket");
      if (onConnected) onConnected(); 
    },
    (error: Error) => console.error("WebSocket connection error:", error)
  );
}

export function getSocketClient() {
  return socketClient;
}

export default function subscribeToNotifications(userId: number) {
  const client = getSocketClient();
  if (!client) return;

  client.subscribe(`/user/${userId}/notification`, async (message: any) => {
    try {
      const parsedBody: NotificationEntity = JSON.parse(message.body);
      const triggeredByUser = await getUserByUserId(parsedBody.triggeredByUserId);

      if (parsedBody.notificationType === "LIKE"){
        toast(`${triggeredByUser.data.name} liked your post.`);
      }
      else if (parsedBody.notificationType === "FOLLOW") {
        toast(`${triggeredByUser.data.name} follows you now!`);
      }
      else if (parsedBody.notificationType === "QUOTE") {
        toast(`${triggeredByUser.data.name} quote retweeted for post!`);
      }
      else if (parsedBody.notificationType === "REPLY") {
        toast(`${triggeredByUser.data.name} replied to your post.`);
      }
      else {
        toast(`${triggeredByUser.data.name} mentioned you in a post.`);        
      }
      
      queryClient.invalidateQueries({
        queryKey: ["user-notifications", userId]
      });
    } catch (e) {
      console.error("Error parsing message body:", e);
    }
  });
}