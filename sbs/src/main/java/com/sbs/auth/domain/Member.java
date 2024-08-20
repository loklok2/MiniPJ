package com.sbs.auth.domain;

import java.time.LocalDateTime;
import jakarta.persistence.*;
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
    private Long id;  // 기본 키로 사용되는 ID, 자동 생성

    private String username;  // 사용자 이름 (로그인 ID로 사용)
    private String password;  // 암호화된 사용자 비밀번호
    private String nickname;  // 사용자 닉네임
    private boolean enabled;  // 계정 활성화 여부

    @Enumerated(EnumType.STRING)
    private Role role;  // 사용자의 역할 (예: ROLE_USER, ROLE_ADMIN)

    private LocalDateTime joinDate = LocalDateTime.now();  // 계정 생성 날짜, 기본값은 현재 시간


}
