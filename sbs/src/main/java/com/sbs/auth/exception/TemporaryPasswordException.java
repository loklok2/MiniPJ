package com.sbs.auth.exception;

import org.springframework.security.core.AuthenticationException;

public class TemporaryPasswordException extends AuthenticationException {
	private static final long serialVersionUID = 1L;

	// 메시지를 받아 AuthenticationException의 생성자를 호출
    public TemporaryPasswordException(String msg) {
        super(msg);
    }
}
