package com.sbs.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // 회원 고유 ID

    private String username;  // 회원의 사용자명 (로그인 ID)
    private String password;  // 회원의 비밀번호

    @Enumerated(EnumType.STRING)
    private Role roles;  // 회원의 권한 정보를 나타내는 Enum 타입 필드

    private String nickname;  // 회원의 닉네임 (8/5 닉네임 추가)
    private String verificationToken;  // 이메일 인증을 위한 토큰
    private boolean enabled;  // 이메일 인증 여부를 나타내는 플래그

    private String resetPasswordToken;
    private LocalDateTime resetPasswordTokenExpiry;

    // 새로운 필드: 임시 비밀번호 여부를 나타내는 플래그
    private boolean temporaryPassword;
}
