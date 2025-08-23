package com.example.posting_service.likes.service;

import com.example.posting_service.common.entity.NotificationEntity;
import com.example.posting_service.common.enums.NotificationStatus;
import com.example.posting_service.common.enums.NotificationType;
import com.example.posting_service.common.service.NotificationRestClientInterface;
import com.example.posting_service.likes.entity.LikeEntity;
import com.example.posting_service.likes.repository.LikeRepository;
import com.example.posting_service.posts.entity.PostEntity;
import com.example.posting_service.posts.repository.PostRepository;
import com.example.posting_service.posts.service.PostService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class LikeServiceImpl implements LikeService{

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private NotificationRestClientInterface notificationRestClientInterface;

    @Autowired
    private PostRepository postRepository;

    @Override
    public LikeEntity saveLikeEntity(LikeEntity likeEntity) {
        LikeEntity savedLike = likeRepository.save(likeEntity);
        if (likeEntity.getLikedByUserId() != likeEntity.getLikedPost().getUserId()){
            NotificationEntity notificationEntity = notificationRestClientInterface.sendNotification(
                    NotificationEntity.builder()
                            .notificationStatus(NotificationStatus.UNREAD)
                            .notifiedUserId(likeEntity.getLikedPost().getUserId())
                            .postId(likeEntity.getLikedPost().getPostId())
                            .notificationTime(new Timestamp(System.currentTimeMillis()))
                            .notificationType(NotificationType.LIKE)
                            .triggeredByUserId(likeEntity.getLikedByUserId())
                            .build()
            );
            log.info("NOTIFICATION ENTITY - {}", notificationEntity);
        }
        return savedLike;
    }

    @Override
    public LikeEntity getLikeEntityById(Long likeId) {
        Optional<LikeEntity> optionalLikeEntity = likeRepository.findById(likeId);
        return optionalLikeEntity.orElse(null);
    }

    @Override
    public String deleteByLikeEntity(LikeEntity likeEntity) {
        try {
            likeRepository.delete(likeEntity);
            return "success";
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            return "failure";
        }
    }

    // THIS TO FIND LIKE ENTITY BY POST ID. TO CALCULATE NUMBER OF LIKES A POST HAS
    @Override
    public List<LikeEntity> getLikesByPostId(Long postId) {
        return likeRepository.findAllByLikedPost_PostId(postId);
    }

    // THIS IS TO FIND LIKE ENTITY BY LIKED POST ID AND LIKED BY USER ID
    @Override
    public LikeEntity getLikeEntityByLikedPostIdAndLikedByUserId(Long likedPostId, Long likedByUserid) {
        Optional<LikeEntity> optionalLikeEntity = likeRepository.findByLikedPost_PostIdAndLikedByUserId(likedPostId, likedByUserid);
        return optionalLikeEntity.orElse(null);
    }

    // THIS IS TO FIND ALL THE POSTS A USER HAS LIKED
    @Override
    public List<LikeEntity> getLikeEntityByLikedUserId(Long userId) {
        return likeRepository.findAllByLikedByUserId(userId);
    }

    @Override
    public List<PostEntity> getLikedPostEntityByUserId(Long userId) {
        List<PostEntity> posts = new ArrayList<>();
        List<LikeEntity> likes = likeRepository.findAllByLikedByUserId(userId);
        for (LikeEntity likeEntity: likes){
            posts.add(postRepository.findByPostId(likeEntity.getLikedPost().getPostId()));
        }
        return posts;
    }
}
