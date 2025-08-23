package com.example.posting_service.bookmarks.service;

import com.example.posting_service.bookmarks.entity.BookmarkEntity;

import java.util.List;

public interface BookmarkService {

    BookmarkEntity addBookmark(BookmarkEntity bookmarkEntity);

    String removeBookmark(Long bookmarkedByUserId, Long bookmarkedPostId);

    List<BookmarkEntity> getAllBookmarksDescendingOrder(Long userId);

    List<BookmarkEntity> findAllByBookmarkedPostId(Long postId);
}
