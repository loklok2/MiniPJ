package com.sbs.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class ResetPasswordRequest {
	private String username;
	private String token;
	private String newPassword;

}
