package com.example.posting_service.likes.controller;

import com.example.posting_service.common.entity.NotificationEntity;
import com.example.posting_service.common.service.NotificationRestClientInterface;
import com.example.posting_service.likes.entity.LikeEntity;
import com.example.posting_service.likes.service.LikeService;
import com.example.posting_service.posts.entity.PostEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/like")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/addLike")
    public LikeEntity addLike(@RequestBody LikeEntity likeEntity){
        return likeService.saveLikeEntity(likeEntity);
    }

    @GetMapping("/getLikeEntityById")
    public LikeEntity getLikeEntityById(@RequestParam Long likeId){
        return likeService.getLikeEntityById(likeId);
    }

    // THIS TO GET LIST OF LIKE ENTITY BY POST ID.
    @GetMapping("/getLikesByPostId")
    public List<LikeEntity> getLikesListByPostId(@RequestParam Long postId){
        return likeService.getLikesByPostId(postId);
    }

    @GetMapping("/getLikedPosts")
    public List<PostEntity> getLikedPosts(@RequestParam Long userId){
        return likeService.getLikedPostEntityByUserId(userId);
    }

    //  TO CALCULATE NUMBER OF LIKES A POST HAS
    @GetMapping("/getPostLikesCount")
    public int getPostLikesCount(@RequestParam Long postId){
        int likes = likeService.getLikesByPostId(postId).size();
        return likes;
    }


    @PostMapping("/deleteLikeEntity")
    public String deleteLikeEntity(@RequestParam Long likedPostId,
                                   @RequestParam Long likedByUserId){
        LikeEntity likeEntity = likeService.getLikeEntityByLikedPostIdAndLikedByUserId(likedPostId, likedByUserId);
        return likeService.deleteByLikeEntity(likeEntity);
    }

    // THIS IS TO FIND ALL THE POSTS A USER HAS LIKED
    @GetMapping("/getLikeEntityByUserId")
    public List<LikeEntity> getLikeEntityByUserId(@RequestParam Long userId){
        return likeService.getLikeEntityByLikedUserId(userId);
    }
}
