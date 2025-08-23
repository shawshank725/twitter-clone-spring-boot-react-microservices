package com.example.posting_service.bookmarks.controller;

import com.example.posting_service.bookmarks.entity.BookmarkEntity;
import com.example.posting_service.bookmarks.service.BookmarkService;
import com.example.posting_service.posts.entity.PostEntity;
import com.example.posting_service.posts.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/bookmark")
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private PostService postService;

    // ADDING A BOOKMARK
    @PostMapping("/addBookmark")
    public BookmarkEntity addBookmark(@RequestBody BookmarkEntity bookmarkEntity){
        return bookmarkService.addBookmark(bookmarkEntity);
    }

    // GET LIST OF ALL BOOKMARKS OF A USER
    @GetMapping("/getAllBookmarksByUserId")
    public List<BookmarkEntity> getAllBookmarks(@RequestParam Long userId){
        return bookmarkService.getAllBookmarksDescendingOrder(userId);
    }

    // TO REMOVE THE BOOKMARK FROM USER'S LIST OF BOOKMARKS
    @PostMapping("/removeBookmark")
    public String removeBookmark(@RequestParam Long bookmarkedByUserId, @RequestParam Long bookmarkedPostId){
        return bookmarkService.removeBookmark(bookmarkedByUserId, bookmarkedPostId);
    }

    // GET POST BOOKMARKS COUNT - HOW MANY TIMES IT IS BOOKMARKED
    @GetMapping("/getPostBookmarkCount")
    public int getPostBookmarkCount(@RequestParam Long postId){
        return bookmarkService.findAllByBookmarkedPostId(postId).size();
    }

    @GetMapping("/getPostEntityBasedOnBookmarks")
    public List<PostEntity> getPostEntityBasedOnBookmarks(@RequestParam Long userId){
        List<BookmarkEntity> bookmarks = bookmarkService.getAllBookmarksDescendingOrder(userId);
        List<PostEntity> posts = new ArrayList<>();
        for (BookmarkEntity bookmark: bookmarks){
            posts.add(postService.findPostByPostId(bookmark.getBookmarkedPost().getPostId()));
        }
        return posts;
    }
}
