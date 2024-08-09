package com.sbs.auth.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sbs.auth.domain.Member;
import com.sbs.auth.domain.SignupRequest;
import com.sbs.auth.domain.UserInfo;
import com.sbs.auth.domain.UserRole;  // 8/9 수정: UserRole 클래스를 사용하기 위해 import 추가
import com.sbs.auth.domain.VerificationToken;  // 8/9 수정: VerificationToken 사용을 위한 import 추가
import com.sbs.auth.domain.ResetPasswordToken;  // 8/9 수정: ResetPasswordToken 사용을 위한 import 추가
import com.sbs.auth.repository.MemberRepository;
import com.sbs.auth.repository.VerificationTokenRepository;  // 8/9 수정: VerificationTokenRepository 주입
import com.sbs.auth.repository.ResetPasswordTokenRepository;  // 8/9 수정: ResetPasswordTokenRepository 주입

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;  // 8/9 수정: VerificationTokenRepository 주입

    @Autowired
    private ResetPasswordTokenRepository resetPasswordTokenRepository;  // 8/9 수정: ResetPasswordTokenRepository 주입

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
        member.setEnabled(false);

        // 8/9 수정: 역할을 설정하기 위해 UserRole 엔티티 사용
        UserRole userRole = new UserRole();
        userRole.setRoleName("ROLE_MEMBER");
        userRole.setMember(member);
        member.getRoles().add(userRole);  // 8/9 수정: UserRole 추가

        memberRepository.save(member);

        // 8/9 수정: VerificationToken 엔티티 사용하여 이메일 인증 토큰 관리
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setMember(member);
        verificationTokenRepository.save(verificationToken);
        
        String verificationLink = "http://localhost:8080/api/auth/verify?token=" + token;
        emailService.sendVerificationEmail(member.getUsername(), verificationLink);
        
        return member;
    }
    

    //닉네임을 기반으로 아이디 찾기 메서드
    public String findUsernameByNickname(String nickname) {
        Optional<Member> member = memberRepository.findByNickname(nickname);
        return member.map(Member::getUsername).orElse(null);
    }

    // 비밀번호 재설정 요청 처리 메서드
    public boolean createPasswordResetToken(String username) {
        Optional<Member> member = memberRepository.findByUsername(username);

        if (member.isPresent()) {
            // 8/9 수정: 비밀번호 재설정 토큰 및 만료 시간 관리
            String token = UUID.randomUUID().toString();
            ResetPasswordToken resetPasswordToken = new ResetPasswordToken();
            resetPasswordToken.setToken(token);
            resetPasswordToken.setMember(member.get());
            resetPasswordToken.setExpiryDate(LocalDateTime.now().plusMinutes(30)); // 만료 시간 설정
            resetPasswordTokenRepository.save(resetPasswordToken);

            String resetLink = "http://localhost:8080/api/auth/reset-password-form?token=" + token;
            emailService.sendVerificationEmail(username, resetLink);

            return true;
        }
        return false;
    }

    // 비밀번호 재설정 처리 메서드
    public boolean resetPassword(String token, String newPassword) {
        Optional<ResetPasswordToken> resetPasswordToken = resetPasswordTokenRepository.findByToken(token);

        if (resetPasswordToken.isPresent() && resetPasswordToken.get().getExpiryDate().isAfter(LocalDateTime.now())) {
            Member member = resetPasswordToken.get().getMember();
            member.setPassword(passwordEncoder.encode(newPassword));
            resetPasswordTokenRepository.delete(resetPasswordToken.get()); // 토큰 제거
            member.setTemporaryPassword(false); // 임시 비밀번호 플래그 해제
            memberRepository.save(member);
            return true;
        }
        return false;
    }
    
    // 이메일 인증 처리
    public boolean verifyEmail(String token) {
        // 8/9 수정: VerificationToken 엔티티 사용
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        Member member = verificationToken.getMember();

        // 인증 토큰이 유효한 경우, 사용자 활성화 및 토큰 제거
        if (member != null) {
            member.setEnabled(true);
            verificationTokenRepository.delete(verificationToken); // 8/9 수정: 인증 토큰 제거
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
    
    // 마이페이지 회원정보 이메일, 닉네임 메서드
    public UserInfo getUserInfo(String username) {
        Member member = memberRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserInfo(member.getUsername(), member.getNickname());
    }
    
    // 임시 비밀번호를 생성하여 사용자의 이메일로 전송하는 메서드
    public boolean sendTemporaryPassword(String email) {
        Optional<Member> memberOptional = memberRepository.findByUsername(email);

        if (memberOptional.isPresent()) {
            Member member = memberOptional.get();
            String tempPassword = generateTemporaryPassword();

            // 임시 비밀번호를 암호화하여 저장
            member.setPassword(passwordEncoder.encode(tempPassword)); // 비밀번호 암호화
            member.setTemporaryPassword(true); // 임시 비밀번호 플래그 설정
            memberRepository.save(member); // 암호화된 임시비밀번호 저장

            // 임시 비밀번호를 이메일로 전송
            emailService.sendTemporaryPasswordEmail(email, tempPassword);
            return true;
        } else {
            return false;
        }
    }

    // 8자리의 임시 비밀번호를 생성하는 메서드
    private String generateTemporaryPassword() {
        Random random = new Random();
        int length = 8;
        StringBuilder sb = new StringBuilder(length);
        String str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (int i = 0; i < length; i++) {
            sb.append(str.charAt(random.nextInt(str.length())));
        }

        return sb.toString();
    }
}
