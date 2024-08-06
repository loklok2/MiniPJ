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
        if (memberRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

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
    
    // 이메일 인증 처리 메서드
    public boolean verifyEmail(String token) {
        Member member = memberRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        member.setEnabled(true);
        member.setVerificationToken(null);
        memberRepository.save(member);
        
        return true;
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
}
