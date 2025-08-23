export type MediaType = "IMAGE" | "VIDEO" | "GIF";


export type PostMediaEntity = {
    mediaId: number;
    mediaUrl: string;
    userId: number;
    mediaType: MediaType;
}

export type NewPostMediaEntity = {
    mediaUrl: string;
    userId: number;
    mediaType: MediaType;
}

