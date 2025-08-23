create database if not exists `connections`;

use `connections`;

CREATE TABLE IF NOT EXISTS `connections` (
    connection_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    follower_id BIGINT NOT NULL,
    followee_id BIGINT NOT NULL,

    UNIQUE (follower_id, followee_id),
    
    CHECK (follower_id <> followee_id)
);

CREATE TABLE IF NOT EXISTS `blocked_users` (
    blocker_id BIGINT NOT NULL,
    blocked_id BIGINT NOT NULL,
    blocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (blocker_id, blocked_id)
);