create database if not exists `notifications`;

use `notifications`;

create table if not exists `notifications` (
	`notification_id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `post_id` BIGINT DEFAULT NULL, 
    `notification_type` ENUM( 'LIKE' , 'QUOTE','REPLY', 'FOLLOW', 'MENTION') NOT NULL,
    `notification_status` ENUM('READ', 'UNREAD') NOT NULL DEFAULT 'UNREAD',
    `notification_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `notified_user_id` BIGINT NOT NULL,
    `triggered_by_user_id` BIGINT NOT NULL,
    
	INDEX (`notified_user_id`),
    INDEX (`notification_status`),
    INDEX (`notification_time`)
);