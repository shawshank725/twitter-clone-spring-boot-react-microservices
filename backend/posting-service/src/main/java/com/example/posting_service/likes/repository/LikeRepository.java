package com.example.posting_service.likes.repository;

import com.example.posting_service.likes.entity.LikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<LikeEntity, Long> {

    List<LikeEntity> findAllByLikedPost_PostId(Long likedPostId);

    Optional<LikeEntity> findByLikedPost_PostIdAndLikedByUserId(Long likedPostId, Long likedByUserid);

    List<LikeEntity> findAllByLikedByUserId(Long userId);
}
