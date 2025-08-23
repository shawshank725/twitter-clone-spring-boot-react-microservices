package com.example.authentication_service.service;

import com.example.authentication_service.entity.RoleEntity;

public interface RoleService {

    RoleEntity findById(int theId);
    RoleEntity findByRoleName(String name);
}
