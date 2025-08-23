import { ImagePlay, Smile, X, Image } from "lucide-react";
import "@styles/components-styles/posts/PostModal.css";
import type { User } from "@/types/Users/User";
import { useState, useRef } from "react";
import { POST_TEXT_LENGTH } from "@constants/MiscConstants";
import EmojiDialogBox from "@components/EmojiDialogBox";
import GiphyDialogBox from "@components/GiphyDialogBox";
import PostTextBar from "@components/posts/PostTextBar";
import { toast } from "react-toastify";
import { uploadMedia } from "@api/service/MediaService";
import { saveNewPost } from "@api/service/PostingService";
import type { NewPostEntity } from "@/types/Posts/PostEntity";
import type { NewPostMediaEntity } from "@/types/Posts/PostMediaEntity";
import useOutsideAlerter from "@hooks/useOutsideAlerter";

type PostModalProps = {
    userInfo: User | null;
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    refer: React.RefObject<HTMLDivElement | null>;

    parentPostId?:number;
    parentUserName?:string;

    doingQuoteRetweet?:boolean;
    doingReply?:boolean;

    setIsQuoteRetweeting?:(isQuoteRetweeting: boolean)=>void;
    setIsReplying?:(isReplying: boolean)=>void;
}

export default function PostModal({ 
    userInfo, isVisible, setIsVisible, refer, 
    parentPostId, parentUserName, doingQuoteRetweet, doingReply, setIsQuoteRetweeting, setIsReplying
}: PostModalProps) {

    const [showGiphyDialogBox, setShowGiphyDialogBox] = useState<boolean>(false);
    const [showEmojiDialogBox, setShowEmojiDialogBox] = useState<boolean>(false);

    const {ref: giphyDialogBoxRef} = useOutsideAlerter<HTMLDivElement>(setShowGiphyDialogBox, undefined);
    const {ref: emojiDialogBoxRef} = useOutsideAlerter<HTMLDivElement>(setShowEmojiDialogBox, undefined);

    const photoRef = useRef<HTMLInputElement>(null);
    const [photosVideos, setPhotosVideos] = useState<(File | string)[]>([]);

    const [postText, setPostText] = useState('');
    const [isPosting, setIsPosting] = useState<boolean>(false);

    const savePost = async () => {
        if (!userInfo || !userInfo.id) {
            console.error("User info or user ID is missing");
            return;
        }

        setIsPosting(true);
        const date = new Date();
        const userId = userInfo.id;
        const mediaList: NewPostMediaEntity[] = [];
        
        try {
            for (let file of photosVideos) {
                if (file instanceof File) {
                    const uploadRes = await uploadMedia(file);
                    mediaList.push({
                        mediaUrl: uploadRes?.data, // uploaded Cloudinary URL
                        userId: userId,
                        mediaType: file.type.startsWith("video/") ? "VIDEO" : "IMAGE"
                    });
                } else if (typeof file === "string") {
                    mediaList.push({
                        mediaUrl: file, // already a gif URL
                        userId: userId,
                        mediaType: "GIF"
                    });
                }
            }
            let quotedPostId: number | null = null;
            let replyToPostId: number | null = null;
            let postType: "ORIGINAL" | "REPLY" | "QUOTE" = "ORIGINAL"; 

            // checking what should be post type
            if (doingReply === true){
                postType = "REPLY"
            }
            else if (doingReply === false ){
                if (doingQuoteRetweet === false){
                    // if this is not a reply and not a quote retweet then it is an original post
                    postType = "ORIGINAL";
                }
                else {
                    // if it is not a reply but quote retweet then its type is quote retweet
                    postType = "QUOTE";
                }
            }

            // putting in the quoted post id (depends on type of post)
            if (postType === "REPLY"){
                quotedPostId = null;
                replyToPostId = parentPostId!;
            }
            else if (postType === "QUOTE"){
                quotedPostId = parentPostId!;
                replyToPostId = null;
            }
            else if (postType ==="ORIGINAL"){
                quotedPostId = replyToPostId = null;
            }

            // Step 2: Construct the full post object
            const newPost: NewPostEntity = {
                userId: userId,
                postText: postText || null,
                quotedPostId: quotedPostId,
                replyToPostId: replyToPostId,
                postType: postType,
                visibility: "PUBLIC",
                createdAt: date.toISOString(),
                updatedAt: date.toISOString(),
                mediaList: mediaList
            };
            // Step 3: Save the full post
            const savedPostResponse = await saveNewPost(newPost);
            console.log("POST IS SAVED - " , savedPostResponse);
            // Step 4: UI cleanup
            setPostText("");
            setPhotosVideos([]);
            toast("Post sent. Check your profile to see the post.");
        } catch (err) {
            toast("Failed to send the post.");
        } finally {
            setIsPosting(false);
            setIsQuoteRetweeting?.(false);
            setIsReplying?.(false);
        }
    };

    return (
        <div className="postModalOuterContainer">
            <div className="postModalInnerContainer">
                <div className="postModal" ref={refer}>
                    <div className="headerPostModal">
                        <X color="black" className="closePostModal" onClick={() => { setIsVisible(!isVisible) }} />
                        {
                            parentUserName && (
                                doingQuoteRetweet ? (
                                <div style={{fontSize:"18px"}}>
                                    <span style={{color:"grey"}}>{"Quote retweeting post of "}</span>
                                    <span style={{color:"blue"}}>{`@${parentUserName}`}</span>
                                </div>
                                ) : doingReply ? (
                                <div style={{fontSize:"18px"}}>
                                    <span style={{color:"grey"}}>{"Replying to "}</span>
                                    <span style={{color:"blue"}}>{`@${parentUserName}`}</span>
                                </div>
                                ) : null
                            )
                        }
                    </div>

                    {/* THIS IS THE ACTUAL CONTENT YOU SEE */}
                    <div className="postModalContentContainer">
                        <div className="postModalProfilePhotoTextAreaContainer">
                            <div>
                                <img src={userInfo?.profilePhoto} className="postModalProfilePhoto" />
                            </div>
                            <div className="postModalTextareaContainer">
                                <textarea rows={10} 
                                    className="postModalTextarea" 
                                    placeholder="Enter something"
                                    value={postText}
                                    onChange={(e) => setPostText(e.target.value)}
                                />
                                
                            
                                <div className="photoVideosContainerPostModal">
                                {
                                    photosVideos.length > 0 && (
                                        <div className="photoVideosContainerPostingArea">
                                        {
                                            photosVideos.map((media, index) => (
                                            <div key={index} className="selectedPhotoVideoContainer">
                                                {typeof media === 'string' ? (
                                                <img src={media} className="selectedPhotoVideo" />
                                                ) : (
                                                media.type.startsWith("video/") ? (
                                                    <video controls className="selectedPhotoVideo">
                                                    <source src={URL.createObjectURL(media)} type={media.type} />
                                                    Your browser does not support the video tag.
                                                    </video>
                                                ) : (
                                                    <img src={URL.createObjectURL(media)} className="selectedPhotoVideo" />
                                                )
                                                )}
                                                <div className="xMarkForClosingContainer">
                                                <X
                                                    size={20}
                                                    onClick={() => {
                                                    setPhotosVideos(prev => prev.filter((_, i) => i !== index));
                                                    }}
                                                />
                                                </div>
                                            </div>
                                            ))
                                        }
                                        </div>
                                    )
                                }
                                </div>
                            </div>
                        </div>
                        {/* THIS IS THE BOTTOM IAMGE VIDEO GIF CONTAINER */}
                            <div className='postModalBottomDivContainer'>
                                <div className='extraMediaUploaderContainer'>

                                    <div className='postModalMediaButtonContainer'>
                                        <Image size={20} color='#1DA1F2' onClick={() => { setShowEmojiDialogBox(false); setShowGiphyDialogBox(false); photoRef.current?.click() }} />
                                        <input
                                            type="file"
                                            name="imagesAndVideos"
                                            accept="image/*,video/*"
                                            hidden multiple
                                            ref={photoRef}
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                setPhotosVideos(prev => {
                                                    const remainingSlots = 4 - prev.length;
                                                    return [...prev, ...files.slice(0, remainingSlots)];
                                                });
                                            }}
                                        />
                                    </div>

                                    <div className='postModalMediaButtonContainer'>
                                        <ImagePlay size={20} color='#1DA1F2' onClick={() => { setShowGiphyDialogBox(!showGiphyDialogBox); setShowEmojiDialogBox(false); }} />
                                        {
                                            showGiphyDialogBox &&
                                            <div className="postModalDialogBoxContainerCurver">
                                                <div className="dialogBoxContainer">
                                                    <GiphyDialogBox
                                                        onGifSelect={(gifUrl: string) => {
                                                            setPhotosVideos(prev => prev.length < 4 ? [...prev, gifUrl] : prev);
                                                            setShowGiphyDialogBox(false);
                                                        }}
                                                        refer={giphyDialogBoxRef}
                                                    />
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    <div className='postModalMediaButtonContainer'>
                                        <Smile size={20} color='#1DA1F2' onClick={() => { setShowEmojiDialogBox(!showEmojiDialogBox); setShowGiphyDialogBox(false); }} />
                                        {
                                            showEmojiDialogBox &&
                                            <div className="postModalDialogBoxContainerCurver">
                                                <div className="dialogBoxContainer">
                                                    <EmojiDialogBox
                                                        onEmojiSelect={(emoji: string) => {
                                                            setPostText(prev => prev + emoji);
                                                        }}
                                                        refer={emojiDialogBoxRef}
                                                    />
                                                </div>
                                            </div>
                                        }
                                    </div>

                                </div>
                                <div className="postButtonProgressBarContainer">
                                    {
                                        postText.length > 0 && <PostTextBar percentage={postText.length} maxValue={POST_TEXT_LENGTH} />
                                    }
                                    <button
                                        className='postButtonHome'
                                        disabled={isPosting || (photosVideos?.length === 0 && postText.trim() === "") || (postText.length > POST_TEXT_LENGTH)}
                                        onClick={() => savePost()}
                                    >Post</button>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}