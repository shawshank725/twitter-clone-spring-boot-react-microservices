import type { PostEntity } from "@/types/Posts/PostEntity";

export type LikeEntity = {
    likeId : number;
    likedByUserId: number;
    likedPost : PostEntity;
    likedAt : string;
}