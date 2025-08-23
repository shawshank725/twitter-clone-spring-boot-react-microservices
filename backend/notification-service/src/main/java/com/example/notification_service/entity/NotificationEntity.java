package com.example.notification_service.entity;

import com.example.notification_service.enums.NotificationStatus;
import com.example.notification_service.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Table(name = "notifications")
@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class NotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    public Long notificationId;

    @Column(name = "post_id", nullable = true)
    private Long postId;

    @Column(name = "notification_type", nullable = false)
    @Enumerated(EnumType.STRING)
    public NotificationType notificationType;

    @Column(name = "notification_status", nullable = false)
    @Enumerated(EnumType.STRING)
    public NotificationStatus notificationStatus = NotificationStatus.UNREAD;

    @Column(name = "notification_time", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    public Timestamp notificationTime;

    @Column(name = "notified_user_id", nullable = false)
    public Long notifiedUserId;

    @Column(name = "triggered_by_user_id", nullable = false)
    public Long triggeredByUserId;


}
