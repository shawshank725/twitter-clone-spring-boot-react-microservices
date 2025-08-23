CREATE DATABASE IF NOT EXISTS `posting`;
USE `posting`;

CREATE TABLE IF NOT EXISTS `posts` (
  `post_id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `post_text` VARCHAR(300),
  `quoted_post_id` BIGINT DEFAULT NULL,
  `reply_to_post_id` BIGINT DEFAULT NULL,
  `post_type` ENUM('ORIGINAL', 'REPLY', 'QUOTE'),
  `visibility` ENUM('PUBLIC', 'PRIVATE', 'FOLLOWERS'),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Self-referencing foreign keys 
  CONSTRAINT `fk_post_quoted`
    FOREIGN KEY (`quoted_post_id`) REFERENCES `posts`(`post_id`)
    ON DELETE SET NULL ON UPDATE CASCADE,

  CONSTRAINT `fk_post_reply_to`
    FOREIGN KEY (`reply_to_post_id`) REFERENCES `posts`(`post_id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `post_media` (
  `media_id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `post_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `media_url` VARCHAR(300),
  `media_type` ENUM('IMAGE', 'VIDEO', 'GIF'),

  CONSTRAINT `fk_media_post`
    FOREIGN KEY (`post_id`) REFERENCES `posts`(`post_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
