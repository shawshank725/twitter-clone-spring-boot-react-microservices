package com.example.timeline_service.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "authentication-service", url = "http://localhost:9999/authentication-service")
public interface AuthenticationRestClientService {

    @GetMapping("/register/getSuggestions")
    List<Long> getSuggestions(
            @RequestParam(required = false) List<Long> followees,
            @RequestParam Long userId
    );

    @GetMapping("/register/getUsersBasedOnSearch")
    public List<Long> getUsersBasedOnSearch(@RequestParam String input);

}
