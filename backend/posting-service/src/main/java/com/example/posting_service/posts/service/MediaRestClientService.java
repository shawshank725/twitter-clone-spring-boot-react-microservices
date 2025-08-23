package com.example.posting_service.posts.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "media-service", url = "http://localhost:9999/media-service")
public interface MediaRestClientService {

    @PostMapping("/media/deleteMedia")
    public String deleteMedia(@RequestParam String imageUrl);

}
