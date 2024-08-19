package com.sbs.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.auth.domain.Member;
import com.sbs.auth.domain.MemberDTO;
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
    public ResponseEntity<?> login(@RequestBody MemberDTO memberDTO) {
        // 로그인 요청을 처리합니다.
        try {
            // 사용자 인증을 시도합니다.
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(memberDTO.getUsername(), memberDTO.getPassword()));
            
            // 이메일 인증 여부 확인
            if (!memberService.isEmailVerified(memberDTO.getUsername())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("이메일 인증 절차를 진행하십시오.");
            }
            
            // 사용자 정보 가져오기
            Member member = memberService.findByUsername(memberDTO.getUsername());
            
            // 인증 성공 시 JWT 토큰을 생성하여 반환합니다.
            String token = JWTUtil.getJWT(memberDTO.getUsername());
            memberDTO.setToken(token);
            memberDTO.setId(member.getId()); // 사용자 ID를 DTO에 설정
            memberDTO.setNickname(member.getNickname()); // 닉네임도 확인하여 설정
            
            return ResponseEntity.ok(memberDTO);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed");
        }
    }
}
