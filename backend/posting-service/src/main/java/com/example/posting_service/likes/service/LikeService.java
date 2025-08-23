package com.example.posting_service.likes.service;

import com.example.posting_service.likes.entity.LikeEntity;
import com.example.posting_service.posts.entity.PostEntity;

import java.util.List;

public interface LikeService {

    LikeEntity saveLikeEntity(LikeEntity likeEntity);

    LikeEntity getLikeEntityById(Long likeId);

    String deleteByLikeEntity(LikeEntity likeEntity);

    List<LikeEntity> getLikesByPostId(Long postId);

    LikeEntity getLikeEntityByLikedPostIdAndLikedByUserId(Long likedPostId, Long likedByUserid);

    List<LikeEntity> getLikeEntityByLikedUserId(Long userId);

    List<PostEntity> getLikedPostEntityByUserId(Long userId);
}
