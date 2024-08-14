package com.sbs.auth.domain;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberDTO {
	private Long id;
    private String username;
    private String password;
    private String nickname;
    private String token;
    private String newPassword;
    private boolean enabled;
    private LocalDateTime joinDate;
    private Role role;
    private TokenType tokenType;
    private LocalDateTime expiryDate;
	
}
