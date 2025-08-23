package com.example.authentication_service.entity;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import org.springframework.beans.factory.annotation.Value;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewUser {

    @NotNull(message = "username is required")
    @Size(min = 3, message = "username must be greater than 2 characters")
    private String username;

    private String name;

    @NotNull(message = "password is required")
    @Size(min = 8, message = "password must be greater than 8 characters")
    private String password;

    @NotNull(message = "email is required")
    @Size(min = 3, message = "email must be valid")
    private String email;

    @Value("${userEntity.profilePhoto}")
    private String profilePhoto;

    @Value("${userEntity.backgroundPhoto}")
    private String backgroundPhoto;

    @Size(min = 160, message = "bio must be less than or equal to 160 characters")
    private String bio;

    @Size(min = 8, message = "website must be less than or equal to 100 characters")
    private String website;

    @Size(max = 30, message = "location must be under 30 characters")
    private String location;

}
