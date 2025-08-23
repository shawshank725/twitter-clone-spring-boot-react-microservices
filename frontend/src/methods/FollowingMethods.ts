import { addConnection, deleteConnectionByBothIds } from "@/api/service/ConnectionService";

export async function FollowUser(userToBeFollowedId: number, userThatWantsToFollowId: number){
    const newConnectionEntity = {followeeId:userToBeFollowedId, followerId: userThatWantsToFollowId };
    const result = await addConnection(newConnectionEntity);
    return result;
}

export async function UnfollowUser(followeeId:number, followerId: number){
    const result = await deleteConnectionByBothIds(followeeId, followerId);
    return result;
}