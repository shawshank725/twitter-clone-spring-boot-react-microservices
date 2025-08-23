package com.example.timeline_service.controller;

import com.example.timeline_service.entity.SearchResult;
import com.example.timeline_service.service.AuthenticationRestClientService;
import com.example.timeline_service.service.PostRestClientInterface;
import com.example.timeline_service.service.TimelineService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/timeline")
public class TimelineController {

    @Autowired
    private TimelineService timelineService;

    @Autowired
    private AuthenticationRestClientService authenticationRestClientService;

    @Autowired
    private PostRestClientInterface postRestClientInterface;

    @GetMapping("/generate")
    public List<Long> generatePosts(
            @RequestParam Long userId
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size
    ){
        return timelineService.generatePosts(userId);
    }

    @GetMapping("/generateFollowSuggestions")
    public List<Long> generateFollowSuggestions(Long userId) {
        List<Long> followees = timelineService.getFollowees(userId);
        return authenticationRestClientService.getSuggestions(followees, userId);
    }

    @GetMapping("/getSearchResult")
    public SearchResult getSearchResult(@RequestParam String input){
        return new SearchResult(
                authenticationRestClientService.getUsersBasedOnSearch(input),
                postRestClientInterface.getPostResults(input) );
    }
}

