package com.example.posting_service.bookmarks.repository;

import com.example.posting_service.bookmarks.entity.BookmarkEntity;
import com.example.posting_service.posts.entity.PostEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<BookmarkEntity, Long> {

    List<BookmarkEntity> findAllByBookmarkedByUserIdOrderByBookmarkedAtDesc(Long userId);

    List<BookmarkEntity> findAllByBookmarkedPost_PostId(Long postId);

    Optional<BookmarkEntity> findByBookmarkedPost_PostIdAndBookmarkedByUserId(Long bookmarkedPostId, Long bookmarkedByUserId);

}
