import type { PostEntity } from "@/types/Posts/PostEntity";

export type BookmarkEntity = {
    bookmarkId: number;
    bookmarkedPost: PostEntity;
    bookmarkedByUserId: number;
    bookmarkedAt: string;
}