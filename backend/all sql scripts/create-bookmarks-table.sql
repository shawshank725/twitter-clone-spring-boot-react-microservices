use `posting`;

CREATE TABLE IF NOT EXISTS `bookmarks` (
`bookmark_id` BIGINT PRIMARY KEY AUTO_INCREMENT,
`bookmarked_by_user_id` BIGINT NOT NULL,
`bookmarked_post_id` BIGINT NOT NULL,
`bookmarked_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
UNIQUE (bookmarked_by_user_id, bookmarked_post_id)
);