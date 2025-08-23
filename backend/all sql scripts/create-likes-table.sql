use `posting`;

CREATE TABLE IF NOT EXISTS `likes` (
`like_id` BIGINT PRIMARY KEY AUTO_INCREMENT,
`liked_by_user_id` BIGINT NOT NULL,
`liked_post_id` BIGINT NOT NULL,
`liked_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
UNIQUE (liked_by_user_id, liked_post_id),
CONSTRAINT `fk_like_post`
FOREIGN KEY (`liked_post_id`) REFERENCES `posts`(`post_id`)
ON DELETE CASCADE ON UPDATE CASCADE
);