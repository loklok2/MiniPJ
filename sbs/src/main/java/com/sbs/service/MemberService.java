package com.sbs.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sbs.domain.Member;
import com.sbs.domain.Role;
import com.sbs.domain.SignupRequest;
import com.sbs.domain.UpdateMemberRequest;
import com.sbs.persistence.MemberRepository;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private EmailService emailService;

    // 회원 가입 처리 메서드
    public Member registerUser(SignupRequest signupRequest) {
        // 사용자 이름(이메일)이 이미 존재하는지 확인
        if (memberRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        // 새로운 Member 객체 생성 및 설정
        Member member = new Member();
        member.setUsername(signupRequest.getUsername());
        member.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        member.setNickname(signupRequest.getNickname());
        member.setRoles(Role.ROLE_MEMBER);
        member.setEnabled(false);

        String token = UUID.randomUUID().toString();
        member.setVerificationToken(token);
        
        memberRepository.save(member);
        
        String verificationLink = "http://localhost:8080/api/auth/verify?token=" + token;
        emailService.sendVerificationEmail(member.getUsername(), verificationLink);
        
        return member;
    }
    

    // 이메일과 닉네임을 기반으로 아이디 찾기 메서드
    public String findUsernameByEmailAndNickname(String email, String nickname) {
        Optional<Member> member = memberRepository.findByUsernameAndNickname(email, nickname);
        return member.map(Member::getUsername).orElse(null);
    }

    // 비밀번호 재설정 요청 처리 메서드
    public boolean createPasswordResetToken(String username) {
        Optional<Member> member = memberRepository.findByUsername(username);

        if (member.isPresent()) {
            String token = UUID.randomUUID().toString();
            member.get().setResetPasswordToken(token);
            member.get().setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(30)); // 만료 시간 설정
            memberRepository.save(member.get());

            String resetLink = "http://localhost:8080/api/auth/reset-password-form?token=" + token;
            emailService.sendVerificationEmail(username, resetLink);

            return true;
        }
        return false;
    }

    // 비밀번호 재설정 처리 메서드
    public boolean resetPassword(String token, String newPassword) {
        Optional<Member> member = memberRepository.findByResetPasswordToken(token);

        if (member.isPresent() && member.get().getResetPasswordTokenExpiry().isAfter(LocalDateTime.now())) {
            member.get().setPassword(passwordEncoder.encode(newPassword));
            member.get().setResetPasswordToken(null); // 토큰 제거
            member.get().setResetPasswordTokenExpiry(null); // 만료 시간 제거
            memberRepository.save(member.get());
            return true;
        }
        return false;
    }
    
    // 이메일 인증 처리
    public boolean verifyEmail(String token) {
        // 인증 토큰으로 사용자를 조회
        Member member = memberRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        // 인증 토큰이 유효한 경우, 사용자 활성화 및 토큰 제거
        if (member != null) {
        	member.setEnabled(true);
        	member.setVerificationToken(null);
        	memberRepository.save(member);
        	
        	return true;        	
        }
        return false;
    }
    
    // 로그인 시 이메일 인증 여부 확인
    public boolean isEmailVerified(String username) {
    	Member member = memberRepository.findByUsername(username)
    			.orElseThrow(() -> new RuntimeException("Member not found"));
    	return member.isEnabled(); // enabled 가 true 면 인증됨
    }
    
    // 마이페이지 사용자 이름으로 조회
    public Member findByUsername(String username) {
    	return memberRepository.findByUsername(username)
    			.orElseThrow(() -> new RuntimeException("Member not found"));
    }
    
 // 회원정보 수정 메서드
    public Member updateMemberInfo(String username, UpdateMemberRequest updateRequest) {
        Member member = findByUsername(username);

        // 닉네임 업데이트
        member.setNickname(updateRequest.getNickname());

        // 비밀번호 업데이트 (선택적)
        if (updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty()) {
            member.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
        }

        return memberRepository.save(member);
    }
}
