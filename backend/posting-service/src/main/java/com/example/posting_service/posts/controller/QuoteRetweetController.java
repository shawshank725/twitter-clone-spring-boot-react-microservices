package com.example.posting_service.posts.controller;

import com.example.posting_service.posts.entity.PostEntity;
import com.example.posting_service.posts.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/quote")
@RequiredArgsConstructor
public class QuoteRetweetController {

    private final PostService postService;

    // GET THE NUMBER OF TIMES A POST WAS QUOTED. SO FIND THAT POST ID IN THE COLUMN QUOTED POST ID IN DATABASE
    @GetMapping("/getQuotedCount")
    public Long getQuotedCounts(@RequestParam Long postId) {
        return postService.getQuotedCounts(postId);
    }

    // GETTING THE POSTS THAT ARE QUOTING ANOTHER POST (POST ID IS GIVEN)
    @GetMapping("/getQuotedPosts")
    public List<PostEntity> getQuotedPosts(@RequestParam Long postId){
        return postService.getQuotedPosts(postId);
    }

}