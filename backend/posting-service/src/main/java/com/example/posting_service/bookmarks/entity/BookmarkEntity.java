package com.example.posting_service.bookmarks.entity;

import com.example.posting_service.posts.entity.PostEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Table(name = "bookmarks", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"bookmarked_by_user_id", "bookmarked_post_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bookmark_id")
    private Long bookmarkId;

    @Column(name = "bookmarked_by_user_id", nullable = false)
    private Long bookmarkedByUserId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bookmarked_post_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "likes", "mediaList"})
    private PostEntity bookmarkedPost;

    @Column(name = "bookmarked_at", nullable = false)
    private Timestamp bookmarkedAt;
}
