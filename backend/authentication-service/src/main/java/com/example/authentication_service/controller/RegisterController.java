package com.example.authentication_service.controller;

import com.example.authentication_service.config.PasswordEncoderConfig;
import com.example.authentication_service.entity.NewUser;
import com.example.authentication_service.entity.UserEntity;
import com.example.authentication_service.service.RoleService;
import com.example.authentication_service.service.UserService;
import io.jsonwebtoken.security.Password;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/register")
public class RegisterController {

    @Autowired
    private UserService userService;

    @Value("${twitter.genres}")
    private List<String> twitterGenres;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("")
    public String registerUser(@RequestBody NewUser newUser){
        try {
            userService.saveTheNewUser(newUser);
            return "success";
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            return "failure";
        }
    }

    @GetMapping("/checkUsername")
    public boolean checkUsername(@RequestParam String username){
        List<String> usernameList = userService.getAllUsernames();
        return usernameList.contains(username);
    }

    @GetMapping("/checkEmail")
    public boolean checkEmail(@RequestParam String email){
        List<String> emailList = userService.getAllEmails();
        return emailList.contains(email);
    }

    @GetMapping("/getUserByUsername")
    public UserEntity getUserByUsername (@RequestParam String username){
        return userService.findByUsername(username);
    }

    @GetMapping("/getUserIdByUsername")
    public long getUserIdByUsername (@RequestParam String username){
        return userService.findByUsername(username).getId();
    }

    @PostMapping("/updateUserProfile")
    public UserEntity updateUserProfile(@RequestBody UserEntity userEntity) {
        UserEntity savedUser = userService.save(userEntity);
        return savedUser;
    }

    @GetMapping("/getUserByUserId")
    public UserEntity getUserByUserId(@RequestParam Long userId){
        return userService.findById(userId);
    }

    @GetMapping("/getSuggestions")
    public List<Long> getSuggestions(
            @RequestParam(required = false) List<Long> followees,
            @RequestParam Long userId
    ) {
        if (followees == null) {
            followees = List.of(); // empty list
        }
        Set<Long> followeeSet = new HashSet<>(followees);

        List<Long> candidates = new ArrayList<>(userService.findAll().stream()
                .map(UserEntity::getId)
                .filter(id -> !id.equals(userId))
                .filter(id -> !followeeSet.contains(id))
                .toList());

        Collections.shuffle(candidates);
        return candidates.stream().limit(4).toList();
    }

    @GetMapping("/getUsersBasedOnSearch")
    public List<Long> getUsersBasedOnSearch(@RequestParam String input){
        return userService
                .getSearchResult(input)
                .stream()
                .map(UserEntity::getId)
                .toList();
    }

    @PostMapping("/updateUsername")
    public String updateUsername(@RequestParam String oldUsername,
                                 @RequestParam String newUsername,
                                 @RequestParam String password) {
        UserEntity userEntity = userService.findByUsername(oldUsername);
        if (userEntity == null) {
            return "failure: user not found";
        }

        if (!passwordEncoder.matches(password, userEntity.getPassword())) {
            return "failure: passwords don't match";
        }

        userEntity.setUsername(newUsername);
        userService.save(userEntity);
        return "success";
    }

    @PostMapping("/changePassword")
    public String changePassword(@RequestParam String username,@RequestParam String oldPassword, @RequestParam String newPassword){
        UserEntity userEntity = userService.findByUsername(username);
        if (!passwordEncoder.matches(oldPassword, userEntity.getPassword())) {
            return "failure: passwords don't match";
        }
        else {
            userEntity.setPassword(passwordEncoder.encode(newPassword));
            userService.save(userEntity);
            return "success";
        }
    }

    @PostMapping("/deleteAccount")
    public String deleteAccount(@RequestParam String username, @RequestParam String password) {
        UserEntity userEntity = userService.findByUsername(username);
        if (userEntity != null) {
            if (!passwordEncoder.matches(password, userEntity.getPassword())) {
                return "failure: incorrect password";
            }
            try {
                // if your DB schema supports cascade delete, just delete user

                userService.delete(userEntity);
                return "success";
            } catch (Exception e) {
                System.out.println(e.getMessage());
                return "failure: could not delete";
            }
        } else {
            return "failure: user not found";
        }
    }

}
