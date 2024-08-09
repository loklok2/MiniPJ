package com.sbs.auth.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class FindUsernameRequest {
	
	private String email;
	private String nickname;

}
