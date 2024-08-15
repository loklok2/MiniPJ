package com.sbs.auth.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

// Lombok 애너테이션을 사용하여 필요한 메서드들을 자동으로 생성합니다.
@Getter @Setter @ToString
@NoArgsConstructor  // 매개변수가 없는 기본 생성자를 자동으로 생성합니다.
@AllArgsConstructor // 모든 필드를 매개변수로 받는 생성자를 자동으로 생성합니다.
public class AuthResponse {
	private String token;  // 인증 토큰을 저장하는 필드입니다.
}
