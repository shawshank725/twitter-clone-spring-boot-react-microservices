import type { ConnectionEntity } from "@/types/Connections/ConnectionEntity";

export type FollowerFolloweeDTO = {
    followeeList: ConnectionEntity[];
    followerList: ConnectionEntity[];
}