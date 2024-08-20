package com.sbs.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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

    @Autowired
    private AuthenticationManager authenticationManager; // 필드 주입

    @Autowired
    private MemberService memberService; // 필드 주입
    
    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody MemberDTO memberDTO) {
        try {
            // 사용자 인증 시도
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(memberDTO.getUsername(), memberDTO.getPassword()));
            
            // 이메일 인증 여부 확인
            if (!memberService.isEmailVerified(memberDTO.getUsername())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("이메일 인증 절차를 진행하십시오.");
            }
            
            // 인증된 사용자 정보 가져오기
            Member member = memberService.findByUsername(memberDTO.getUsername());
            
            // JWT 토큰 생성 후 반환
            String token = JWTUtil.getJWT(memberDTO.getUsername());
            memberDTO.setToken(token); // JWT 토큰 설정
            memberDTO.setId(member.getId()); // 사용자 ID 설정
            memberDTO.setNickname(member.getNickname()); // 닉네임 설정
            
            return ResponseEntity.ok(memberDTO); // 사용자 정보와 JWT 토큰 반환
        } catch (AuthenticationException e) {
            // 인증 실패 시 UNAUTHORIZED 상태 반환
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
        }
    }
}
