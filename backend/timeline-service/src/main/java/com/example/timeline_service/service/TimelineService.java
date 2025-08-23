package com.example.timeline_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class TimelineService {

    private final ConnectionRestClientInterface connectionRestClientInterface;
    private final PostRestClientInterface postRestClientInterface;

    public List<Long> generatePosts(Long userId){
        // get the followees of the user
        Set<Long> followees = connectionRestClientInterface.getUserConnectionsList(userId);

        // get the post ids of the posts made by the user's followees
        List<Long> postIds = postRestClientInterface.getPostIDs(followees);
        log.info("GENERATING POSTS ------- {}", postIds);
        return postIds;
    }

    public List<Long> getFollowees(Long userId){
        return new ArrayList<>(connectionRestClientInterface.getUserConnectionsList(userId));
    }

}
