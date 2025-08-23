import { useNavigate } from "react-router-dom";
import type { User } from "@/types/Users/User"
import {Image, Smile, ImagePlay, X } from 'lucide-react';

import '@styles/components-styles/posts/PostingArea.css';
import { useRef, useState } from "react";
import GiphyDialogBox from "@components/GiphyDialogBox";
import EmojiDialogBox from "@components/EmojiDialogBox";
import type { NewPostEntity } from "@/types/Posts/PostEntity";
import {  saveNewPost } from "@api/service/PostingService";
import { toast } from "react-toastify";
import { uploadMedia } from "@api/service/MediaService";
import type { NewPostMediaEntity } from "@/types/Posts/PostMediaEntity";
import PostTextBar from "@components/posts/PostTextBar";
import { POST_TEXT_LENGTH } from "@constants/MiscConstants";
import useOutsideAlerter from "@hooks/useOutsideAlerter";

type UserProp = {
  userInfo: User | null;
  replyingToPostId?: number;
}

export default function PostingArea({userInfo, replyingToPostId}: UserProp) {
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

      // Step 2: Construct the full post object
      const newPost: NewPostEntity = {
        userId: userId,
        postText: postText || null,
        quotedPostId: null,
        replyToPostId: replyingToPostId ?? null,
        postType: "ORIGINAL",
        visibility: "PUBLIC",
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
        mediaList: mediaList 
      };

      // Step 3: Save the full post
      const savedPostResponse = await saveNewPost(newPost);
      console.log("Post created successfully:", savedPostResponse.data);

      // Step 4: UI cleanup
      setPostText("");
      setPhotosVideos([]);
      toast("Post sent. Check your profile to see the post.");
    } catch (err) {
      console.error("Error saving post:", err);
      toast("Failed to send the post.");
    } finally {
      setIsPosting(false);
    }
  };


  const navigate = useNavigate();
    return (
      <div className='postingArea'>
        <div className='profilePhotoHomeContainer' onClick={()=> {navigate(`/${userInfo?.username}`)}}>
          <img src={userInfo?.profilePhoto} className='profilePhotoHome'/>
        </div>

        <div className='postingAreaRightSideContainer'>
          <div className='textFieldHomeContainer'>
            <textarea 
              placeholder="What's Happening?" 
              className='postingAreaTextField'
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
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

          <div className='homeBottomDivContainer'>
            <div className='extraMediaUploaderContainer'>
              
              <div className='mediaButtonContainer'>
                <Image size={20} color='#1DA1F2' onClick={()=> {setShowEmojiDialogBox(false); setShowGiphyDialogBox(false); photoRef.current?.click()}}/>
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

              <div className='mediaButtonContainer'>
                <ImagePlay size={20} color='#1DA1F2'  onClick={()=> {setShowGiphyDialogBox(!showGiphyDialogBox); setShowEmojiDialogBox(false);}} />
                {
                  showGiphyDialogBox && 
                  <div className="dialogBoxContainerCurver">
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

              <div className='mediaButtonContainer'>
                <Smile size={20} color='#1DA1F2'  onClick={()=> {setShowEmojiDialogBox(!showEmojiDialogBox); setShowGiphyDialogBox(false);}} />
                {
                  showEmojiDialogBox && 
                  <div className="dialogBoxContainerCurver">
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
                postText.length > 0 && <PostTextBar percentage={postText.length} maxValue={POST_TEXT_LENGTH}/>
              }
              <button 
                className='postButtonHome' 
                disabled={isPosting || (photosVideos?.length === 0 && postText.trim() === "") || (postText.length > POST_TEXT_LENGTH)}
                onClick={()=> savePost()}
              >Post</button>
            </div>
          </div>
        </div>
      </div>
    )
}