package com.example.timeline_service.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Set;

@FeignClient(name = "connection-service", url = "http://localhost:9999/connection-service")
public interface ConnectionRestClientInterface {

    @GetMapping("/connection/getUserConnectionsList")
    public Set<Long> getUserConnectionsList(@RequestParam Long userId);

}
