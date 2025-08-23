package com.example.connection_service.service;

import com.example.connection_service.common.entity.NotificationEntity;
import com.example.connection_service.common.enums.NotificationStatus;
import com.example.connection_service.common.enums.NotificationType;
import com.example.connection_service.common.service.NotificationRestClientInterface;
import com.example.connection_service.entity.ConnectionEntity;
import com.example.connection_service.repository.ConnectionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
@Slf4j
public class ConnectionService {

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private NotificationRestClientInterface notificationRestClientInterface;

    public ConnectionEntity addConnection(ConnectionEntity connectionEntity){
        ConnectionEntity savedConnection = connectionRepository.save(connectionEntity);
        NotificationEntity notificationEntity = notificationRestClientInterface.sendNotification(
                NotificationEntity.builder()
                        .notificationStatus(NotificationStatus.UNREAD)
                        .notifiedUserId(connectionEntity.getFolloweeId())
                        .postId(null)
                        .notificationTime(new Timestamp(System.currentTimeMillis()))
                        .notificationType(NotificationType.FOLLOW)
                        .triggeredByUserId(connectionEntity.getFollowerId())
                        .build()
        );
        log.info("NOTIFICATION ENTITY - {}", notificationEntity);
        return savedConnection;
    }

    public String deleteConnectionByEntity(ConnectionEntity connectionEntity){
        try {
            connectionRepository.delete(connectionEntity);
            return "success";
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            return "failure";
        }
    }

    public String deleteConnectionById(long connectionId){
        try {
            connectionRepository.deleteById(connectionId);
            return "success";
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            return "failure";
        }
    }

    public List<ConnectionEntity> getFollowersOfAUser(Long userId){
        return connectionRepository.findAllByFolloweeId(userId);
    }

    public List<ConnectionEntity> getUsersFollowedByUser(Long userId){
        return connectionRepository.findAllByFollowerId(userId);
    }

    public ConnectionEntity findByFollowerAndFolloweeId(Long followerId, Long followeeId){
        return connectionRepository.findByFollowerIdAndFolloweeId(followerId, followeeId).orElse(null);
    }

    public String deleteConnectionByFollowerAndFolloweeId(Long followerId, Long followeeId){
        try {
            ConnectionEntity connectionEntity = connectionRepository.findByFollowerIdAndFolloweeId(followerId, followeeId).orElse(null);
            assert connectionEntity != null;
            connectionRepository.delete(connectionEntity);
            return "success";
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            return "failure";
        }
    }
}
