package com.sbs.auth.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String nickname;
    private boolean enabled;

    @Enumerated(EnumType.STRING)
    private Role role;  // 단일 역할 관리
    
    private LocalDateTime joinDate = LocalDateTime.now();
    
    private boolean temporaryPassword;

    // 기타 필드들 및 메서드들
}
