import type { PostEntity } from "@/types/Posts/PostEntity";

export type NewBookmarkEntity = {
    bookmarkedPost: PostEntity;
    bookmarkedByUserId: number;
    bookmarkedAt: string;
}