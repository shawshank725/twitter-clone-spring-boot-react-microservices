package com.example.authentication_service.service;

import com.example.authentication_service.entity.LoginUser;
import com.example.authentication_service.entity.NewUser;
import com.example.authentication_service.entity.UserEntity;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    List<UserEntity> findAll();
    UserEntity findByUsername(String username);
    UserEntity findById(Long userId);
    UserEntity save(UserEntity userEntity);
    void delete(UserEntity userEntity);
    void saveTheNewUser(NewUser newUser);
    List<String> getAllUsernames();
    List<String> getAllEmails();
    List<UserEntity> getSearchResult(String input);
}
