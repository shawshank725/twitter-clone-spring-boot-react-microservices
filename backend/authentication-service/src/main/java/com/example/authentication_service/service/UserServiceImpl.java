package com.example.authentication_service.service;

import com.example.authentication_service.entity.*;
import com.example.authentication_service.repository.RoleRepository;
import com.example.authentication_service.repository.UserEntityRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService, UserDetailsService {

    @Autowired
    private UserEntityRepository userEntityRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public List<UserEntity> findAll() {
        return userEntityRepository.findAll();
    }

    @Override
    public UserEntity findByUsername(String username) {
        return userEntityRepository.findByUsername(username);
    }

    @Override
    public UserEntity findById(Long userId) {
        Optional<UserEntity> result =  userEntityRepository.findById(userId);
        return result.orElse(null);
    }

    @Override
    @Transactional
    public UserEntity save(UserEntity userEntity) {
        return userEntityRepository.save(userEntity);
    }

    @Override
    @Transactional
    public void delete(UserEntity userEntity) {
        userEntityRepository.delete(userEntity);
    }

    @Override
    public void saveTheNewUser(NewUser newUser) {
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(newUser.getUsername());
        userEntity.setEmail(newUser.getEmail());
        userEntity.setName(newUser.getName());
        userEntity.setEnabled(true);
        userEntity.setPassword(passwordEncoder.encode(newUser.getPassword()));
        userEntity.setProfilePhoto(newUser.getProfilePhoto());
        userEntity.setBackgroundPhoto(newUser.getBackgroundPhoto());

        userEntity.setBio(null);
        userEntity.setWebsite(null);
        userEntity.setLocation(null);

        userEntity.setRoles(Arrays.asList(roleRepository.findByRoleName("ROLE_USER")));

        userEntityRepository.save(userEntity);
    }

    @Override
    public List<String> getAllUsernames() {
        return userEntityRepository.findAllUsernames();
    }

    @Override
    public List<String> getAllEmails() {
        return userEntityRepository.findAllEmails();
    }

    @Override
    public List<UserEntity> getSearchResult(String input) {
        return userEntityRepository.findByUsernameContainingIgnoreCaseOrNameContainingIgnoreCase(input, input);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity userEntity = userEntityRepository.findByUsername(username);
        return new CustomUserDetails(userEntity);
    }


}
