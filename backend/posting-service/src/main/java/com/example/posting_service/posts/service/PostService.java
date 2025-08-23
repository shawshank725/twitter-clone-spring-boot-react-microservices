package com.example.posting_service.posts.service;

import com.example.posting_service.common.entity.NotificationEntity;
import com.example.posting_service.common.enums.NotificationStatus;
import com.example.posting_service.common.enums.NotificationType;
import com.example.posting_service.common.service.NotificationRestClientInterface;
import com.example.posting_service.posts.entity.PostEntity;
import com.example.posting_service.posts.entity.PostMediaEntity;
import com.example.posting_service.posts.repository.PostRepository;
import com.example.posting_service.posts.repository.PostMediaRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.sql.Timestamp;
import java.util.*;

@Service
@Slf4j
public class PostService{

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostMediaRepository postMediaRepository;

    @Autowired
    private MediaRestClientService mediaRestClientService;

    @Autowired
    private UserRestClientService userRestClientService;

    @Autowired
    private NotificationRestClientInterface notificationRestClientInterface;

    public PostEntity addPost(PostEntity postEntity) {
        PostEntity savedPost = postRepository.save(postEntity);
        String postText = savedPost.getPostText();
        String[] postTextSplit = postText.split(" ");
        String allowedPattern = "^[A-Za-z0-9_\\p{So}\\p{Cn}\\p{L}\\p{M}]+$";

        List<String> mentionedUsers = new ArrayList<>();

        for (String i : postTextSplit) {
            if (i.startsWith("@") && i.length() > 1) {
                String username = i.substring(1);
                if (username.matches(allowedPattern)) {
                    mentionedUsers.add(username);
                } else {
                    System.out.println("Invalid username mention skipped: " + username);
                }
            }
        }
        for (String i: mentionedUsers){
            String mentionedUsername = i;
            long mentionedUserId = userRestClientService.getUserIdByUsername(mentionedUsername);
            if (mentionedUserId != 0 && mentionedUserId != postEntity.getUserId()) {
                try {
                    notificationRestClientInterface.sendNotification(
                            NotificationEntity.builder()
                                    .notificationStatus(NotificationStatus.UNREAD)
                                    .notifiedUserId(mentionedUserId) // keep it Long
                                    .postId(postEntity.getPostId())
                                    .notificationTime(new Timestamp(System.currentTimeMillis()))
                                    .notificationType(NotificationType.MENTION)
                                    .triggeredByUserId(postEntity.getUserId())
                                    .build()
                    );
                } catch (Exception e) {
                    log.error("Failed to send notification for mention: {}", mentionedUsername, e);
                }

            }
        }
        if (postEntity.getQuotedPostId() !=null) {
            Optional<PostEntity> originalPostEntity = postRepository.findById(postEntity.getQuotedPostId());
            if (originalPostEntity.isPresent() && (!Objects.equals(originalPostEntity.get().getUserId(), postEntity.getUserId()))){
                notificationRestClientInterface.sendNotification(
                        NotificationEntity.builder()
                                .notificationStatus(NotificationStatus.UNREAD)
                                .notifiedUserId(originalPostEntity.get().getUserId())
                                .postId(postEntity.getPostId())
                                .notificationTime(new Timestamp(System.currentTimeMillis()))
                                .notificationType(NotificationType.QUOTE)
                                .triggeredByUserId(postEntity.getUserId())
                                .build()
                );
            }
        }

        if (postEntity.getReplyToPostId() !=null) {
            Optional<PostEntity> originalPostEntity = postRepository.findById(postEntity.getReplyToPostId());
            if (originalPostEntity.isPresent() && (!Objects.equals(originalPostEntity.get().getUserId(), postEntity.getUserId()))){
                notificationRestClientInterface.sendNotification(
                        NotificationEntity.builder()
                                .notificationStatus(NotificationStatus.UNREAD)
                                .notifiedUserId(originalPostEntity.get().getUserId())
                                .postId(postEntity.getPostId())
                                .notificationTime(new Timestamp(System.currentTimeMillis()))
                                .notificationType(NotificationType.REPLY)
                                .triggeredByUserId(postEntity.getUserId())
                                .build()
                );
            }
        }
        return savedPost;
    }

    public List<PostEntity> getUsersPosts(Long userId) {
        return postRepository.findAllByUserId(userId);
    }

    public List<PostEntity> getUsersPostsAscendingOrder(Long userId) {
        return postRepository.findAllByUserIdOrderByCreatedAtAsc(userId);
    }

    public List<PostEntity> getUsersPostsDescendingOrder(Long userId) {
        return postRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
    }

    public String deletePostByPostId(Long postId) {
        try {
            List<PostMediaEntity> mediaEntityList = postRepository.findById(postId).get().getMediaList();
            for (PostMediaEntity postMediaEntity: mediaEntityList){
                String mediaUrl = postMediaEntity.getMediaUrl();
                if (mediaUrl.contains("res.cloudinary")){
                    String output = mediaRestClientService.deleteMedia(mediaUrl);
                }
            }
            //postMediaRepository.deleteAll(mediaEntityList);
            postRepository.deleteById(postId);
            return "success";
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            return "failure";
        }
    }

    public PostEntity findPostByPostId(Long postId) {
        Optional<PostEntity> result = postRepository.findById(postId);
        return result.orElse(null);
    }

    public Long getQuotedCounts(Long postId){
        return postRepository.countQuotes(postId);
    }

    public List<PostEntity> getQuotedPosts(Long postId){
        return postRepository.findAllByQuotedPostId(postId);
    }

    public List<PostEntity> findRepliedPostsByPostId(Long postId){
        return postRepository.findAllByReplyToPostIdOrderByCreatedAtDesc(postId);
    }

    public List<PostEntity> getPostResults(String input){
        return postRepository.findByPostTextContainingIgnoreCase(input);
    }
}
