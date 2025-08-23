package com.example.notification_service.service;

import com.example.notification_service.entity.NotificationEntity;
import com.example.notification_service.enums.NotificationStatus;
import com.example.notification_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final NotificationRepository notificationRepository;

    public NotificationEntity sendNotification(NotificationEntity notificationEntity){
        log.info("sending ws notification to {} with payload {}", notificationEntity.getNotifiedUserId(), notificationEntity);
        NotificationEntity savedNotificationEntity = saveNotification(notificationEntity);
        simpMessagingTemplate.convertAndSendToUser(
                String.valueOf(notificationEntity.getNotifiedUserId()),
                "/notification",
                savedNotificationEntity);
        return savedNotificationEntity;
    }

    public NotificationEntity saveNotification(NotificationEntity notificationEntity){
        return notificationRepository.save(notificationEntity);
    }

    public List<NotificationEntity> getNotificationsByUser(Long userId){
        return notificationRepository.findByNotifiedUserIdOrderByNotificationTimeDesc(userId);
    }

    public int getUnreadNotificationsCount(NotificationStatus status, Long userId){
        return notificationRepository.countByNotifiedUserIdAndNotificationStatus(userId,status);
    }

    public NotificationEntity markNotificationAsRead(Long notificationId){
        Optional<NotificationEntity> notificationEntityOptional = notificationRepository.findById(notificationId);
        if (notificationEntityOptional.isPresent()){
            NotificationEntity notificationEntity = notificationEntityOptional.get();
            notificationEntity.setNotificationStatus(NotificationStatus.READ);
            return notificationRepository.save(notificationEntity);
        }
        else {
            return null;
        }
    }

    public String deleteNotificationEntity(Long notificationId){
        try {
            notificationRepository.deleteById(notificationId);
            return "success";
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            return "failure";
        }
    }
}
