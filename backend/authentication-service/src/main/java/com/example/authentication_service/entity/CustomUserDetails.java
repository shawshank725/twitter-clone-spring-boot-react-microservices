package com.example.authentication_service.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;

@Data
@Getter
@Setter
public class CustomUserDetails implements UserDetails {

    private Long id;
    private String username;
    private String password;
    private String name;
    private String email;
    private String bio;
    private String website;
    private String location;

    private String profile_photo;
    private Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(UserEntity userEntity) {
        this.id = userEntity.getId();
        this.username = userEntity.getUsername();
        this.password = userEntity.getPassword();
        this.name = userEntity.getName();
        this.email = userEntity.getEmail();
        this.profile_photo = userEntity.getProfilePhoto();
        this.bio = userEntity.getBio();
        this.website = userEntity.getWebsite();
        this.location = userEntity.getLocation();
        this.authorities = userEntity.getRoles()
                .stream()
                .map(role -> new SimpleGrantedAuthority(role.getAuthority()))
                .collect(Collectors.toList());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities; // Return actual authorities
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }


}
