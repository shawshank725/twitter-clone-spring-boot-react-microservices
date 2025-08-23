import type { PostEntity } from "@/types/Posts/PostEntity";

export type NewLikeEntity = {
    likedByUserId: number;
    likedPost : PostEntity;
    likedAt : string;
}