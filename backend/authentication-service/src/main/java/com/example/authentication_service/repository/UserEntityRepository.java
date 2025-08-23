package com.example.authentication_service.repository;

import com.example.authentication_service.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserEntityRepository extends JpaRepository<UserEntity, Long> {

    UserEntity findByUsername(String username);

    @Query("SELECT u.username FROM UserEntity u")
    List<String> findAllUsernames();

    @Query("SELECT u.email FROM UserEntity u")
    List<String> findAllEmails();

    List<UserEntity> findByUsernameContainingIgnoreCaseOrNameContainingIgnoreCase(String username, String name);
}
