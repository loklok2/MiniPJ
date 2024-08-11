package com.sbs.auth.service;

import java.time.LocalDateTime;
import java.util.Optional;
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

import jakarta.transaction.Transactional;

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
        if (memberRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        Member member = Member.builder()
                .username(signupRequest.getUsername())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .nickname(signupRequest.getNickname())
                .enabled(false) // 초기 상태는 비활성화
                .role(Role.ROLE_MEMBER)
                .build();

        memberRepository.save(member);
        createVerificationToken(member);

        return member;
    }

    public boolean createVerificationToken(Member member) {
        String tokenValue = UUID.randomUUID().toString();
        Token token = Token.builder()
                .tokenType(TokenType.VERIFICATION)
                .tokenValue(tokenValue)
                .expiryDate(LocalDateTime.now().plusDays(1))
                .member(member)
                .build();
        tokenRepository.save(token);

        String verificationLink = "http://localhost:8080/api/auth/verify?token=" + tokenValue;
        emailService.sendVerificationEmail(member.getUsername(), verificationLink);
        return true;
    }

    public boolean verifyEmail(String tokenValue) {
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
        Optional<Member> memberOpt = memberRepository.findByUsername(username);

        if (memberOpt.isPresent()) {
            Member member = memberOpt.get();
            String tokenValue = UUID.randomUUID().toString();
            Token token = Token.builder()
                    .tokenType(TokenType.RESET_PASSWORD)
                    .tokenValue(tokenValue)
                    .expiryDate(LocalDateTime.now().plusMinutes(30)) // 30분 유효한 토큰
                    .member(member)
                    .build();
            tokenRepository.save(token);

            String resetLink = "http://localhost:8080/api/auth/reset-password-form?token=" + tokenValue;
            emailService.sendPasswordResetMail(username, resetLink);
            return true;
        }
        return false;
    }
    
    public boolean validateResetToken(String tokenValue) {
        return tokenRepository.findByTokenValue(tokenValue)
                .map(token -> token.getTokenType() == TokenType.RESET_PASSWORD && token.getExpiryDate().isAfter(LocalDateTime.now()))
                .orElse(false);
    }

    @Transactional
    public boolean resetPassword(String tokenValue, String newPassword) {
        Token token = tokenRepository.findByTokenValue(tokenValue)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        if (token.getTokenType() == TokenType.RESET_PASSWORD && token.getExpiryDate().isAfter(LocalDateTime.now())) {
            Member member = token.getMember();
            member.setPassword(passwordEncoder.encode(newPassword));
            member.setTemporaryPassword(false);
            memberRepository.save(member);
            tokenRepository.delete(token); // 사용된 토큰 삭제
            return true;
        }
        return false;
    }

    public String findUsernameByNickname(String nickname) {
        return memberRepository.findByNickname(nickname)
                .map(Member::getUsername)
                .orElse(null);
    }

    public boolean isEmailVerified(String username) {
        return memberRepository.findByUsername(username)
                .map(Member::isEnabled)
                .orElse(false);
    }

    public UserInfo getUserInfo(String username) {
        Member member = memberRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserInfo(member.getUsername(), member.getNickname());
    }
}
