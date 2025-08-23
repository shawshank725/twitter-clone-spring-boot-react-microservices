package com.example.connection_service.dto;

import com.example.connection_service.entity.ConnectionEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FollowerFolloweeDTO {

    private List<ConnectionEntity> followeeList;
    private List<ConnectionEntity> followerList;

}