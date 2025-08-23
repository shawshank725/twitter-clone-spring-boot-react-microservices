package com.example.posting_service.posts.repository;

import com.example.posting_service.posts.entity.PostEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<PostEntity, Long> {

    List<PostEntity> findAllByUserId(Long userId);

    List<PostEntity> findAllByUserIdOrderByCreatedAtAsc(Long userId);

    List<PostEntity> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    List<PostEntity> findAllByReplyToPostIdOrderByCreatedAtDesc(Long postId);

    PostEntity findByPostId(Long postId);

    List<PostEntity> findByPostTextContainingIgnoreCase(String content);

    @Query("SELECT COUNT(p) FROM PostEntity p WHERE p.quotedPostId = :postId")
    Long countQuotes(@Param("postId") Long postId);

    List<PostEntity> findAllByQuotedPostId(Long postId);

}
