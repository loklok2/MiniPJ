package com.sbs.auth.domain;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Data
public class ResetPasswordRequest {
	private String username;
	private String token;
	private String newPassword;

}
