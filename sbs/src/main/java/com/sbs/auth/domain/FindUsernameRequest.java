package com.sbs.auth.domain;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Data
public class FindUsernameRequest {
	
	private String email;
	private String nickname;

}
