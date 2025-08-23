package com.example.notification_service.repository;

import com.example.notification_service.entity.NotificationEntity;
import com.example.notification_service.enums.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    List<NotificationEntity> findByNotifiedUserIdOrderByNotificationTimeDesc(Long userId);
    int countByNotifiedUserIdAndNotificationStatus(Long userId, NotificationStatus status);
}
