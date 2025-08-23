package com.example.posting_service.posts.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "authentication-service" , url = "http://localhost:9999/authentication-service")
public interface UserRestClientService {

    @GetMapping("/register/getUserIdByUsername")
    public long getUserIdByUsername (@RequestParam String username);
}
