package com.example.connection_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "connections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "connection_id")
    private Long connectionId;

    @Column(name = "follower_id", nullable = false)
    private Long followerId; // who is following

    @Column(name = "followee_id", nullable = false)
    private Long followeeId; // who is being followed


}
