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

    public Member registerUser(SignupRequest signupRequest) {
        // 회원 가입 요청을 처리하고, 이메일 인증 토큰을 생성합니다.
        if (memberRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        Member member = new Member();
        member.setUsername(signupRequest.getUsername());
        member.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        member.setNickname(signupRequest.getNickname());
        member.setEnabled(false); // 초기 상태는 비활성화
        member.setRole(Role.ROLE_MEMBER);

        memberRepository.save(member);
        createVerificationToken(member);

        return member;
    }

    public boolean createVerificationToken(Member member) {
        // 이메일 인증을 위한 토큰을 생성하고 발송합니다.
        String tokenValue = UUID.randomUUID().toString();
        Token token = new Token();
        token.setTokenType(TokenType.VERIFICATION);
        token.setTokenValue(tokenValue);
        token.setExpiryDate(LocalDateTime.now().plusDays(1));
        token.setMember(member);
        tokenRepository.save(token);

        String verificationLink = "http://localhost:8080/api/auth/verify?token=" + tokenValue;
        emailService.sendVerificationEmail(member.getUsername(), verificationLink);
        return true;
    }

    public boolean verifyEmail(String tokenValue) {
        // 이메일 인증을 처리합니다.
        Token token = tokenRepository.findByTokenValue(tokenValue)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        if (token.getTokenType() != TokenType.VERIFICATION || token.getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }

        Member member = token.getMember();
        member.setEnabled(true);
        tokenRepository.delete(token); // 사용된 토큰 삭제
        memberRepository.save(member);
        return true;
    }

    public boolean createPasswordResetToken(String username) {
        // 비밀번호 재설정 토큰을 생성하고 이메일로 발송합니다.
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

            String resetLink = "http://localhost:8080/api/auth/reset-password-form?token=" + tokenValue;
            emailService.sendPasswordResetMail(username, resetLink);
            return true;
        }
        return false;
    }

    public boolean resetPassword(String tokenValue, String newPassword) {
        // 비밀번호를 재설정합니다.
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

    public String findUsernameByNickname(String nickname) {
        // 닉네임을 통해 사용자명을 찾습니다.
        Optional<Member> member = memberRepository.findByNickname(nickname);
        return member.map(Member::getUsername).orElse(null);
    }

    public boolean isEmailVerified(String username) {
        // 사용자의 이메일 인증 여부를 확인합니다.
        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        return member.isEnabled();
    }

    public UserInfo getUserInfo(String username) {
        // 사용자 정보를 반환합니다.
        Member member = memberRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserInfo(member.getUsername(), member.getNickname());
    }

    public boolean sendTemporaryPassword(String email) {
        // 임시 비밀번호를 생성하여 이메일로 발송합니다.
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

    private String generateTemporaryPassword() {
        // 랜덤한 임시 비밀번호를 생성합니다.
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
