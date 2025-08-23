import { getVideoFormat } from "@methods/OtherMethods";
import type { PostEntity } from "@/types/Posts/PostEntity"

type PostMediaDisplayerProp = {
    postEntity: PostEntity;
    setSelectedPhoto:(imageUrl: string)=> void;
}


export default function PostMediaDisplayer({postEntity, setSelectedPhoto}: PostMediaDisplayerProp) {
    
    return (
        <div>
            {
                postEntity.mediaList.length === 1 && (
                    postEntity.mediaList[0].mediaType === "IMAGE" ? (
                        <div className='postCardSingleImageContainer'>
                            <img
                                src={postEntity.mediaList[0].mediaUrl}
                                className='postCardSingleImage'
                                onClick={() => setSelectedPhoto(postEntity.mediaList[0].mediaUrl)}
                            />
                        </div>
                    ) : postEntity.mediaList[0].mediaType === "VIDEO" ? (
                        <div className='postCardSingleImageContainer'>
                            <video
                                className='postCardSingleImage'
                                controls>
                                <source src={postEntity.mediaList[0].mediaUrl}
                                    type={getVideoFormat(postEntity.mediaList[0].mediaUrl)} />
                            </video>
                        </div>
                    ) : null
                )
            }

            {
                postEntity.mediaList.length === 2 && (
                    <div className='postCardDoubleImageGridContainer'>
                        <div className='postCardDoubleImageContainer'>
                            {postEntity.mediaList.map((media, index) => (
                                media.mediaType === "IMAGE" ? (
                                    <img
                                        key={index}
                                        src={media.mediaUrl}
                                        className='postCardDoubleImage'
                                        onClick={() => setSelectedPhoto(media.mediaUrl)}
                                    />
                                ) : (
                                    <video
                                        key={index}
                                        className='postCardDoubleImage'
                                        controls
                                    >
                                        <source src={media.mediaUrl} type={getVideoFormat(media.mediaUrl)} />
                                    </video>
                                )
                            ))}
                        </div>
                    </div>
                )
            }
            {
                postEntity.mediaList.length === 3 && (
                    <div className='postCardOuterThreeImageContainer'>
                        <div className='postLeftContainer'>
                            <div className='imageTopContainer'>
                                {postEntity.mediaList[0].mediaType === "IMAGE" ? (
                                    <img
                                        src={postEntity.mediaList[0].mediaUrl}
                                        className='imageTop'
                                        onClick={() => setSelectedPhoto(postEntity.mediaList[0].mediaUrl)}
                                    />
                                ) : (
                                    <video controls className='imageTop'>
                                        <source src={postEntity.mediaList[0].mediaUrl} type={getVideoFormat(postEntity.mediaList[0].mediaUrl)} />
                                    </video>
                                )}
                            </div>
                            <div className='imageBottomContainer'>
                                {postEntity.mediaList[1].mediaType === "IMAGE" ? (
                                    <img
                                        src={postEntity.mediaList[1].mediaUrl}
                                        className='imageTop'
                                        onClick={() => setSelectedPhoto(postEntity.mediaList[1].mediaUrl)}
                                    />
                                ) : (
                                    <video controls className='imageTop'>
                                        <source src={postEntity.mediaList[1].mediaUrl} type={getVideoFormat(postEntity.mediaList[1].mediaUrl)} />
                                    </video>
                                )}
                            </div>
                        </div>
                        <div className='postRightContainer'>
                            {postEntity.mediaList[2].mediaType === "IMAGE" ? (
                                <img
                                    src={postEntity.mediaList[2].mediaUrl}
                                    className='postCardRightSideSingleImage'
                                    onClick={() => setSelectedPhoto(postEntity.mediaList[2].mediaUrl)}
                                />
                            ) : (
                                <video controls className='postCardRightSideSingleImage'>
                                    <source src={postEntity.mediaList[2].mediaUrl} type={getVideoFormat(postEntity.mediaList[2].mediaUrl)} />
                                </video>
                            )}
                        </div>
                    </div>
                )
            }

            {
                postEntity.mediaList.length === 4 && (
                    <div className='postCardFourItemsContainer'>
                        {
                            postEntity.mediaList.map((object, index) => (
                                <div className='imageGridContainer' key={index}>
                                    {object.mediaType === "IMAGE" ? (
                                        <img
                                            src={object.mediaUrl}
                                            className='imageInGrid'
                                            onClick={() => setSelectedPhoto(object.mediaUrl)}
                                        />
                                    ) : (
                                        <video controls className='imageInGrid'>
                                            <source src={object.mediaUrl} type={getVideoFormat(object.mediaUrl)} />
                                        </video>
                                    )}
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}