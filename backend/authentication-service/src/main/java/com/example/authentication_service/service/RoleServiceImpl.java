package com.example.authentication_service.service;


import com.example.authentication_service.entity.RoleEntity;
import com.example.authentication_service.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public RoleEntity findById(int theId) {
        Optional<RoleEntity> roleEntityOptional = roleRepository.findById(theId);
        if (roleEntityOptional.isPresent()){
            return roleEntityOptional.get();
        }
        return null;
    }

    @Override
    public RoleEntity findByRoleName(String name) {
        RoleEntity roleEntity = roleRepository.findByRoleName(name);
        System.out.println(roleEntity.toString());
        return roleEntity;
    }
}
