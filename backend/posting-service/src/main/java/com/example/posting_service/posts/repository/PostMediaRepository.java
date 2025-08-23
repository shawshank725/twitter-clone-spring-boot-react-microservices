package com.example.posting_service.posts.repository;

import com.example.posting_service.posts.entity.PostEntity;
import com.example.posting_service.posts.entity.PostMediaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostMediaRepository extends JpaRepository<PostMediaEntity, Long> {

    List<PostMediaEntity> findAllByPostEntity(PostEntity postEntity);

    List<PostMediaEntity> findAllByUserId(Long userId);
}
