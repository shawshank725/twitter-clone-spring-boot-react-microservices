create database if not exists `authentication`;

use `authentication`;

set foreign_key_checks = 1;
create table if not exists `users`(
  `user_id` BIGINT primary key auto_increment,
  `username` varchar(50) unique key NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL, 
  `bio` varchar(160), 
  `website` varchar(100), 
  `location` varchar(30), 
  
  `password` varchar(60) NOT NULL,
  `enabled` tinyint NOT NULL,
  `profile_photo` varchar(200) DEFAULT "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
  `background_photo` varchar(200) DEFAULT "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/2011-03-09-fort-du-lomont-10.jpg/800px-2011-03-09-fort-du-lomont-10.jpg",
  `joined_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `roles` (
`role_id` int NOT NULL AUTO_INCREMENT,
`role_name` varchar(50) DEFAULT NULL,
PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `roles` VALUES 
(1, "ROLE_USER"),
(2, "ROLE_ADMIN");

CREATE TABLE `users_roles` (
  `user_id` BIGINT NOT NULL,
  `role_id` int NOT NULL,
  
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FK_ROLE_idx` (`role_id`),
  
  CONSTRAINT `FK_USER_05` FOREIGN KEY (`user_id`) 
  REFERENCES `users` (`user_id`) 
  ON DELETE NO ACTION ON UPDATE NO ACTION,
  
  CONSTRAINT `FK_ROLE` FOREIGN KEY (`role_id`) 
  REFERENCES `roles` (`role_id`) 
  ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

set foreign_key_checks = 1;