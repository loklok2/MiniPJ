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

<<<<<<< HEAD
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final MemberService memberService;
=======
@RestController  // 이 클래스가 RESTful 웹 서비스의 컨트롤러임을 나타냅니다.
public class LoginController {

    private final AuthenticationManager authenticationManager;

    // AuthenticationManager를 주입받는 생성자
    public LoginController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }
>>>>>>> 39f029607ac6fbf2f2b70ef3312d7de8be263b46
    
    // CORS 설정: 특정 도메인에서만 이 엔드포인트를 호출할 수 있도록 허용합니다.
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/api/login")  // HTTP POST 요청을 처리하며, 경로는 "/api/login"입니다.
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
<<<<<<< HEAD
        	// 사용자 인증
=======
            // 사용자가 입력한 사용자명과 비밀번호로 인증을 시도합니다.
>>>>>>> 39f029607ac6fbf2f2b70ef3312d7de8be263b46
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
            
            // 이메일 인증 여부 확인
            if (!memberService.isEmailVerified(loginRequest.getUsername())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("이메일 인증 절차를 진행하십시오.");
            }

<<<<<<< HEAD
            // static 메서드는 클래스 이름을 통해 호출, 인증된 사용자에게 JWT 토큰 발급
=======
            // 인증이 성공하면 JWT 토큰을 생성합니다.
>>>>>>> 39f029607ac6fbf2f2b70ef3312d7de8be263b46
            String token = JWTUtil.getJWT(loginRequest.getUsername());
            // 생성된 JWT 토큰을 AuthResponse 객체로 감싸서 반환합니다.
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (AuthenticationException e) {
<<<<<<< HEAD
        	// 상세 오류 메시지 확인
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
=======
            // 인증이 실패하면 HTTP 401 UNAUTHORIZED 상태와 함께 오류 메시지를 반환합니다.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed");
>>>>>>> 39f029607ac6fbf2f2b70ef3312d7de8be263b46
        }
    }
}
