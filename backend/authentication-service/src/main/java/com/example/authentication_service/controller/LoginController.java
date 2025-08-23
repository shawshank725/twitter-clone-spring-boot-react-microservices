package com.example.authentication_service.controller;

import com.example.authentication_service.entity.LoginUser;
import com.example.authentication_service.entity.UserEntity;
import com.example.authentication_service.service.JWTService;
import com.example.authentication_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class LoginController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JWTService jwtService;

    @PostMapping("/login")
    public String login(@RequestBody LoginUser loginUser){
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginUser.getUsername(),
                                loginUser.getPassword()));
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(loginUser.getUsername()) ;
        }
        return "fail";
    }

    @GetMapping("/getUser")
    public UserEntity getUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String username = jwtService.extractUserName(token);
        return userService.findByUsername(username);
    }


}
