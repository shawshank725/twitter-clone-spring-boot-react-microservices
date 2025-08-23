import type { PostEntity } from "@/types/Posts/PostEntity"
import type { PostMediaEntity } from "@/types/Posts/PostMediaEntity";

export type PostWithMediaDTO = {
    postEntity: PostEntity;
    mediaList: PostMediaEntity[];
}