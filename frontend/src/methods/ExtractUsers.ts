import type { FollowerFolloweeDTO } from "@/types/Connections/FollowerFolloweeDTO";
import type { FollowerFolloweeNumbers } from "@/types/Connections/FollowerFolloweeNumbers";

export function extractIdsFromDTO(dto: FollowerFolloweeDTO): FollowerFolloweeNumbers {
  const followerIds = dto.followerList.map(conn => conn.followerId);
  const followeeIds = dto.followeeList.map(conn => conn.followeeId);

  return {
    follower: followerIds,
    followee: followeeIds
  };
}
