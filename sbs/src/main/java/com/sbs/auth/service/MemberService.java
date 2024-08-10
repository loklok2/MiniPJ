package com.sbs.auth.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sbs.auth.domain.Member;
import com.sbs.auth.domain.Role;
import com.sbs.auth.domain.SignupRequest;
import com.sbs.auth.domain.Token;
import com.sbs.auth.domain.TokenType;
import com.sbs.auth.domain.UserInfo;
import com.sbs.auth.repository.MemberRepository;
import com.sbs.auth.repository.TokenRepository;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    /**
     * 회원 가입 처리를 담당합니다.
     * 회원 정보를 저장하고 이메일 인증 토큰을 생성합니다.
     */
    public Member registerUser(SignupRequest signupRequest) {
        // 이미 존재하는 사용자 이름인지 확인합니다.
        if (memberRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        // 새로운 회원 정보를 생성합니다.
        Member member = new Member();
        member.setUsername(signupRequest.getUsername());
        member.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        member.setNickname(signupRequest.getNickname());
        member.setEnabled(false); // 초기 상태는 비활성화
        member.setRole(Role.ROLE_MEMBER); // 단일 역할 설정

        memberRepository.save(member);

        // 이메일 인증 토큰 생성 및 발송
        createVerificationToken(member);

        return member;
    }

    /**
     * 이메일 인증 토큰을 생성하고 회원에게 발송합니다.
     */
    public boolean createVerificationToken(Member member) {
        // UUID를 이용해 토큰 값을 생성합니다.
        String tokenValue = UUID.randomUUID().toString();
        Token token = new Token();
        token.setTokenType(TokenType.VERIFICATION);
        token.setTokenValue(tokenValue);
        token.setExpiryDate(LocalDateTime.now().plusDays(1)); // 토큰의 만료 시간 설정
        token.setMember(member);
        tokenRepository.save(token);

        // 인증 링크 생성 및 이메일 발송
        String verificationLink = "http://localhost:8080/api/auth/verify?token=" + tokenValue;
        emailService.sendVerificationEmail(member.getUsername(), verificationLink);
        return true;
    }

    /**
     * 이메일 인증을 처리합니다.
     * 유효한 토큰인 경우, 사용자의 상태를 활성화합니다.
     */
    public boolean verifyEmail(String tokenValue) {
        Token token = tokenRepository.findByTokenValue(tokenValue)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        // 토큰이 유효하지 않거나 만료된 경우
        if (token.getTokenType() != TokenType.VERIFICATION || token.getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }

        Member member = token.getMember();
        member.setEnabled(true);
        tokenRepository.delete(token); // 사용된 토큰 삭제
        memberRepository.save(member);
        return true;
    }

    /**
     * 비밀번호 재설정 토큰을 생성하고 사용자에게 이메일로 발송합니다.
     */
    public boolean createPasswordResetToken(String username) {
        Optional<Member> memberOpt = memberRepository.findByUsername(username);

        if (memberOpt.isPresent()) {
            Member member = memberOpt.get();
            String tokenValue = UUID.randomUUID().toString();
            Token token = new Token();
            token.setTokenType(TokenType.RESET_PASSWORD);
            token.setTokenValue(tokenValue);
            token.setExpiryDate(LocalDateTime.now().plusMinutes(30)); // 30분 유효한 토큰
            token.setMember(member);
            tokenRepository.save(token);

            // 비밀번호 재설정 링크 생성 및 이메일 발송
            String resetLink = "http://localhost:8080/api/auth/reset-password-form?token=" + tokenValue;
            emailService.sendPasswordResetMail(username, resetLink);
            return true;
        }
        return false;
    }

    /**
     * 비밀번호를 재설정합니다.
     * 유효한 토큰인 경우, 사용자의 비밀번호를 변경합니다.
     */
    public boolean resetPassword(String tokenValue, String newPassword) {
        Optional<Token> tokenOpt = tokenRepository.findByTokenValue(tokenValue);

        if (tokenOpt.isPresent()) {
            Token token = tokenOpt.get();
            if (token.getTokenType() == TokenType.RESET_PASSWORD && token.getExpiryDate().isAfter(LocalDateTime.now())) {
                Member member = token.getMember();
                member.setPassword(passwordEncoder.encode(newPassword));
                member.setTemporaryPassword(false);
                memberRepository.save(member);
                tokenRepository.delete(token); // 사용된 토큰 삭제
                return true;
            }
        }
        return false;
    }

    /**
     * 닉네임을 통해 사용자명을 찾습니다.
     */
    public String findUsernameByNickname(String nickname) {
        Optional<Member> member = memberRepository.findByNickname(nickname);
        return member.map(Member::getUsername).orElse(null);
    }

    /**
     * 사용자의 이메일 인증 여부를 확인합니다.
     */
    public boolean isEmailVerified(String username) {
        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        return member.isEnabled();
    }

    /**
     * 사용자 정보를 반환합니다.
     */
    public UserInfo getUserInfo(String username) {
        Member member = memberRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserInfo(member.getUsername(), member.getNickname());
    }

    /**
     * 임시 비밀번호를 생성하여 사용자에게 이메일로 발송합니다.
     */
    public boolean sendTemporaryPassword(String email) {
        Optional<Member> memberOptional = memberRepository.findByUsername(email);

        if (memberOptional.isPresent()) {
            Member member = memberOptional.get();
            String tempPassword = generateTemporaryPassword();

            member.setPassword(passwordEncoder.encode(tempPassword));
            member.setTemporaryPassword(true);
            memberRepository.save(member);

            emailService.sendTemporaryPasswordEmail(email, tempPassword);
            return true;
        } else {
            return false;
        }
    }

    /**
     * 랜덤한 임시 비밀번호를 생성합니다.
     */
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
