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
import com.sbs.util.JWTUtil;

@RestController  // 이 클래스가 RESTful 웹 서비스의 컨트롤러임을 나타냅니다.
public class LoginController {

    private final AuthenticationManager authenticationManager;

    // AuthenticationManager를 주입받는 생성자
    public LoginController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }
    
    // CORS 설정: 특정 도메인에서만 이 엔드포인트를 호출할 수 있도록 허용합니다.
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/api/login")  // HTTP POST 요청을 처리하며, 경로는 "/api/login"입니다.
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // 사용자가 입력한 사용자명과 비밀번호로 인증을 시도합니다.
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            // 인증이 성공하면 JWT 토큰을 생성합니다.
            String token = JWTUtil.getJWT(loginRequest.getUsername());
            // 생성된 JWT 토큰을 AuthResponse 객체로 감싸서 반환합니다.
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (AuthenticationException e) {
            // 인증이 실패하면 HTTP 401 UNAUTHORIZED 상태와 함께 오류 메시지를 반환합니다.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed");
        }
    }
}
