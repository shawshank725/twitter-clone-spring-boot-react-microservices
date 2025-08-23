package com.example.posting_service.posts.service;


import com.example.posting_service.posts.entity.PostMediaEntity;
import com.example.posting_service.posts.repository.PostRepository;
import com.example.posting_service.posts.repository.PostMediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostMediaService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostMediaRepository postMediaRepository;

    public PostMediaEntity addPostMedia(PostMediaEntity postMediaEntity) {
        System.out.println(postMediaEntity.toString());
        return postMediaRepository.save(postMediaEntity);
    }

    public List<PostMediaEntity> getUsersPostMediasByPostId(Long postId) {
        return postMediaRepository.findAllByPostEntity(postRepository.findById(postId).get());
    }

    public List<PostMediaEntity> getUsersPostMediasByUserId(Long userId) {
        return postMediaRepository.findAllByUserId(userId);
    }

}
