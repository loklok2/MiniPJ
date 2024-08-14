package com.sbs.auth.domain;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Data
public class LoginRequest {
    private String username;  // 사용자가 입력한 사용자명 (로그인 ID)
    private String password;  // 사용자가 입력한 비밀번호
}
