package com.sbs.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sbs.domain.Member;
import com.sbs.domain.Role;
import com.sbs.domain.SignupRequest;
import com.sbs.persistence.MemberRepository;

@Service  // 이 클래스가 Spring의 서비스 컴포넌트임을 나타냅니다.
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;  // MemberRepository를 주입받아 사용합니다.

    @Autowired
    private PasswordEncoder passwordEncoder;  // 비밀번호를 암호화하기 위한 PasswordEncoder를 주입받아 사용합니다.
    
    @Autowired
    private EmailService emailService;  // 이메일 전송을 처리하는 EmailService를 주입받아 사용합니다.

    // 회원 가입 처리 메서드
    public Member registerUser(SignupRequest signupRequest) {
        // 사용자 이름(이메일)이 이미 존재하는지 확인
        if (memberRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Username is already taken");  // 이미 존재하는 경우 예외 발생
        }

        // 새로운 Member 객체 생성 및 설정
        Member member = new Member();
        member.setUsername(signupRequest.getUsername());  // 사용자 이름 설정 (이메일)
        member.setPassword(passwordEncoder.encode(signupRequest.getPassword()));  // 비밀번호 암호화 후 설정
        member.setNickname(signupRequest.getNickname());  // 닉네임 설정
        member.setRoles(Role.ROLE_MEMBER);  // 기본 역할 설정
        member.setEnabled(false);  // 이메일 인증 완료 전까지 비활성화

        // 이메일 인증 토큰 생성 및 설정
        String token = UUID.randomUUID().toString();  // UUID를 사용하여 고유한 토큰 생성
        member.setVerificationToken(token);
        
        // 사용자 저장
        memberRepository.save(member);
        
        // 이메일 인증 링크 생성 및 발송
        String verificationLink = "http://localhost:8080/api/auth/verify?token=" + token;
        emailService.sendVerificationEmail(member.getUsername(), verificationLink);  // 이메일 전송
        
        return member;
    }
    
    // 이메일 인증 처리 메서드
    public boolean verifyEmail(String token) {
        // 인증 토큰으로 사용자를 조회
        Member member = memberRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));  // 토큰이 유효하지 않으면 예외 발생

        // 인증 토큰이 유효한 경우, 사용자 활성화 및 토큰 제거
        member.setEnabled(true);  // 사용자 활성화
        member.setVerificationToken(null);  // 인증 토큰 제거
        memberRepository.save(member);  // 변경사항 저장
        
        return true;
    }
}
