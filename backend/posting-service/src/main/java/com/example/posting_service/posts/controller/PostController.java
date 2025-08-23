package com.example.posting_service.posts.controller;

import com.example.posting_service.posts.entity.NewPostMediaEntity;
import com.example.posting_service.posts.entity.PostEntity;
import com.example.posting_service.posts.entity.PostMediaEntity;
import com.example.posting_service.posts.service.PostMediaService;
import com.example.posting_service.posts.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/post")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final PostMediaService postMediaService;

    @PostMapping("/addPost")
    public PostEntity addPost(@Valid @RequestBody PostEntity postEntity){
        for (PostMediaEntity media : postEntity.getMediaList()) {
            media.setPostEntity(postEntity);
        }
        return postService.addPost(postEntity);
    }

    @PostMapping("/addMedia")
    public PostMediaEntity addMedia(@RequestBody NewPostMediaEntity newPostMediaEntity){

        PostMediaEntity postMediaEntity = new PostMediaEntity();
        postMediaEntity.setPostEntity(newPostMediaEntity.getPostEntity());
        postMediaEntity.setUserId(newPostMediaEntity.getUserId());
        postMediaEntity.setMediaUrl(newPostMediaEntity.getMediaUrl());
        postMediaEntity.setMediaType(newPostMediaEntity.getMediaType());

        return postMediaService.addPostMedia(postMediaEntity);
    }

    // getting user's posts using USER ID
    @GetMapping("/getUsersPosts")
    public List<PostEntity> getUsersPosts(@RequestParam Long userId){
        return postService.getUsersPostsDescendingOrder(userId);
    }

    // deleting post by POST ID
    @PostMapping("/deletePost")
    public String deletePost(@RequestParam Long postId){
        return postService.deletePostByPostId(postId);
    }

    @GetMapping("/getPostByPostId")
    public PostEntity getPostByPostId(Long postId){
        return postService.findPostByPostId(postId);
    }

    @GetMapping("/getRepliesToPost")
    public List<PostEntity> getRepliesToPost(@RequestParam Long postId){
        return postService.findRepliedPostsByPostId(postId);
    }


    @GetMapping("/getPostIDs")
    public List<Long> getPostIDs(@RequestParam Set<Long> userIds) {
        List<Long> postIds = new ArrayList<>();

        for (Long id : userIds) {
            List<Long> userPostIds = postService.getUsersPosts(id)
                    .stream()
                    .map(PostEntity::getPostId)
                    .toList();
            postIds.addAll(userPostIds);
        }

        return postIds;
    }

    @GetMapping("/getPostResults")
    public List<Long> getPostResults(@RequestParam String input){
        return postService.getPostResults(input)
                .stream()
                .map(PostEntity::getPostId)
                .toList();
    }

    @PostMapping("/deletePostsOfUser")
    public String deleteAllPostsOfUser(@RequestParam Long userId){
        try {
            List<PostEntity> posts = postService.getUsersPosts(userId);
            for (PostEntity post: posts){
                postService.deletePostByPostId(post.getPostId());
            }
            return "success";
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            return "failure";
        }
    }

}