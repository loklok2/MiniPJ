package com.sbs.service;

<<<<<<< HEAD
=======
import java.time.LocalDateTime;
import java.util.Optional;
>>>>>>> 39f029607ac6fbf2f2b70ef3312d7de8be263b46
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

<<<<<<< HEAD
    // 회원 가입 처리
=======
    // 회원 가입 처리 메서드
>>>>>>> 39f029607ac6fbf2f2b70ef3312d7de8be263b46
    public Member registerUser(SignupRequest signupRequest) {
        // 사용자 이름(이메일)이 이미 존재하는지 확인
        if (memberRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        // 새로운 Member 객체 생성 및 설정
        Member member = new Member();
        member.setUsername(signupRequest.getUsername());
        member.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
<<<<<<< HEAD
        member.setNickname(signupRequest.getNickname()); // 닉네임 저장
        member.setRoles(Role.ROLE_MEMBER);
        member.setEnabled(false); // 이메일 인증 완료 전까지 비활성화

        // 이메일 인증 토큰 생성 및 설정
        String token = UUID.randomUUID().toString();
        member.setVerificationToken(token);
        
        // 사용자 저장
        memberRepository.save(member);
        
        // 이메일 인증 링크 생성 및 발송
=======
        member.setNickname(signupRequest.getNickname());
        member.setRoles(Role.ROLE_MEMBER);
        member.setEnabled(false);

        String token = UUID.randomUUID().toString();
        member.setVerificationToken(token);
        
        memberRepository.save(member);
        
>>>>>>> 39f029607ac6fbf2f2b70ef3312d7de8be263b46
        String verificationLink = "http://localhost:8080/api/auth/verify?token=" + token;
        emailService.sendVerificationEmail(member.getUsername(), verificationLink);
        
        return member;
<<<<<<< HEAD
=======
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
>>>>>>> 39f029607ac6fbf2f2b70ef3312d7de8be263b46
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
    
}
