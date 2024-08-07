package com.sbs.controller;

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

import com.sbs.domain.AuthResponse;
import com.sbs.domain.LoginRequest;
import com.sbs.service.MemberService;
import com.sbs.util.JWTUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final MemberService memberService;
    
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
        	// 사용자 인증
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
            
            // 이메일 인증 여부 확인
            if (!memberService.isEmailVerified(loginRequest.getUsername())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("이메일 인증 절차를 진행하십시오.");
            }

            // static 메서드는 클래스 이름을 통해 호출, 인증된 사용자에게 JWT 토큰 발급
            String token = JWTUtil.getJWT(loginRequest.getUsername());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (AuthenticationException e) {
        	// 상세 오류 메시지 확인
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
        }
    }
}
