package com.sbs.security;

import org.springframework.security.core.AuthenticationException;

public class TemporaryPasswordException extends AuthenticationException {

    public TemporaryPasswordException(String msg) {
        super(msg);
    }
}
