package com.sbs.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.auth.domain.AuthResponse;
import com.sbs.auth.domain.LoginRequest;
import com.sbs.auth.service.MemberService;
import com.sbs.util.JWTUtil;

@RestController
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final MemberService memberService;

    public LoginController(AuthenticationManager authenticationManager, MemberService memberService) {
        this.authenticationManager = authenticationManager;
        this.memberService = memberService;
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // 로그인 요청을 처리합니다.
        try {
            // 사용자 인증을 시도합니다.
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
            
            // 이메일 인증 여부 확인
            if (!memberService.isEmailVerified(loginRequest.getUsername())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("이메일 인증 절차를 진행하십시오.");
            }

            // 인증 성공 시 JWT 토큰을 생성하여 반환합니다.
            String token = JWTUtil.getJWT(loginRequest.getUsername());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed");
        }
    }
}
