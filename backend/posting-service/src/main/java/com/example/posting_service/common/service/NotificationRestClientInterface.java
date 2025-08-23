package com.example.posting_service.common.service;

import com.example.posting_service.common.entity.NotificationEntity;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service", url = "http://localhost:9999/notification-service")
public interface NotificationRestClientInterface {

    @PostMapping(value = "/notifications/sendNotification",
            consumes = "application/json",
            produces = "application/json")
    public NotificationEntity sendNotification(
            @RequestBody NotificationEntity notificationEntity
    );

}
