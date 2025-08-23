package com.example.timeline_service.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Set;

@FeignClient(name = "posting-service", url = "http://localhost:9999/posting-service")
public interface PostRestClientInterface {

    @GetMapping("/post/getPostIDs")
    public List<Long> getPostIDs(@RequestParam Set<Long> userIds);

    @GetMapping("/post/getPostResults")
    public List<Long> getPostResults(@RequestParam String input);
}
