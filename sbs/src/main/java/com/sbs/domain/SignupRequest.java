package com.sbs.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class SignupRequest {
	
	private String username; //8/5 username이라고 해놓고 이메일이라고 하자
	private String password;
	private String nickname; //8/5 닉네임 필드추가
}
