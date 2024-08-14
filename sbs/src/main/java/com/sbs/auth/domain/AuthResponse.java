package com.sbs.auth.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor 
@AllArgsConstructor 
public class AuthResponse {
	private String token;  // 인증 토큰을 저장하는 필드입니다.
}
