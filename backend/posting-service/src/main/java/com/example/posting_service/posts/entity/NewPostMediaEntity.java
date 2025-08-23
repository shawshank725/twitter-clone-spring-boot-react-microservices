package com.example.posting_service.posts.entity;

import com.example.posting_service.posts.enums.PostMediaEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewPostMediaEntity {

    private PostEntity postEntity;

    private String mediaUrl;

    private Long userId;

    @Enumerated(EnumType.STRING)
    private PostMediaEnum mediaType;

}
