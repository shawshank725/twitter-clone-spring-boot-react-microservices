package com.example.posting_service.likes.entity;

import com.example.posting_service.posts.entity.PostEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Table(name = "likes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"liked_by_user_id", "liked_post_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"likedPost"})
@EqualsAndHashCode(exclude = {"likedPost"})
public class LikeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "like_id")
    private Long likeId;

    @Column(name = "liked_by_user_id", nullable = false)
    private Long likedByUserId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "liked_post_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "likes", "mediaList"})
    private PostEntity likedPost;

    @Column(name = "liked_at", nullable = false)
    private Timestamp likedAt;

}
