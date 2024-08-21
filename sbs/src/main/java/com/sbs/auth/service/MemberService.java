package com.sbs.auth.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.sbs.auth.domain.Member;
import com.sbs.auth.domain.MemberDTO;
import com.sbs.auth.domain.Role;
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

    // 사용자 등록 메서드
    public Member registerUser(MemberDTO memberDTO) {
        if (memberRepository.existsByUsername(memberDTO.getUsername())) {
            // 이미 존재하는 사용자 이름인 경우 예외 발생
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용 중인 사용자 이름입니다.");
        }

        // 새로운 사용자 생성
        Member member = new Member();
        member.setUsername(memberDTO.getUsername());
        member.setPassword(passwordEncoder.encode(memberDTO.getPassword())); // 비밀번호 암호화
        member.setNickname(memberDTO.getNickname());
        member.setEnabled(false); // 초기 상태는 비활성화
        member.setRole(Role.ROLE_MEMBER); // 기본 역할 설정

        memberRepository.save(member); // 사용자 저장
        createVerificationToken(member); // 이메일 인증 토큰 생성 및 전송

        return member;
    }

    // 이메일 인증 토큰 생성 메서드
    public boolean createVerificationToken(Member member) {
        String tokenValue = UUID.randomUUID().toString(); // 랜덤 토큰 생성
        Token token = new Token();
        token.setTokenType(TokenType.VERIFICATION); // 인증 토큰 타입 설정
        token.setTokenValue(tokenValue);
        token.setExpiryDate(LocalDateTime.now().plusDays(1)); // 토큰 만료 시간 설정
        token.setMember(member);
        tokenRepository.save(token); // 토큰 저장

        String verificationLink = "http://localhost:8080/api/auth/verify?token=" + tokenValue;
        emailService.sendVerificationEmail(member.getUsername(), verificationLink); // 이메일 전송
        return true;
    }

    // 이메일 인증 처리 메서드
    public boolean verifyEmail(String tokenValue) {
        Token token = tokenRepository.findByTokenValue(tokenValue)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "유효하지 않은 인증 토큰입니다."));

        // 토큰 유형이 인증 토큰인지 확인하고 만료 여부 검사
        if (token.getTokenType() != TokenType.VERIFICATION || token.getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }

        Member member = token.getMember();
        member.setEnabled(true); // 계정 활성화
        tokenRepository.delete(token); // 사용된 토큰 삭제
        memberRepository.save(member); // 변경된 사용자 정보 저장
        return true;
    }

    // 비밀번호 재설정 토큰 생성 메서드
    public boolean createPasswordResetToken(String username) {
        Optional<Member> memberOpt = memberRepository.findByUsername(username);

        if (memberOpt.isPresent()) {
            Member member = memberOpt.get();
            String tokenValue = UUID.randomUUID().toString(); // 랜덤 토큰 생성
            Token token = new Token();
            token.setTokenType(TokenType.RESET_PASSWORD); // 비밀번호 재설정 토큰 타입 설정
            token.setTokenValue(tokenValue);
            token.setExpiryDate(LocalDateTime.now().plusMinutes(30)); // 30분 유효한 토큰
            token.setMember(member);
            tokenRepository.save(token); // 토큰 저장

            String resetLink = "http://localhost:3000/reset-password?token=" + tokenValue; // 비밀번호 재설정 링크 생성
            emailService.sendPasswordResetMail(username, resetLink); // 이메일 전송
            return true;
        }
        return false;
    }

    // 비밀번호 재설정 처리 메서드
    public boolean resetPassword(String tokenValue, String newPassword) {
        Optional<Token> tokenOpt = tokenRepository.findByTokenValue(tokenValue);

        if (tokenOpt.isPresent()) {
            Token token = tokenOpt.get();
            // 토큰 유형이 비밀번호 재설정 토큰인지 확인하고 만료 여부 검사
            if (token.getTokenType() == TokenType.RESET_PASSWORD && token.getExpiryDate().isAfter(LocalDateTime.now())) {
                Member member = token.getMember();
                member.setPassword(passwordEncoder.encode(newPassword)); // 새 비밀번호 암호화
                memberRepository.save(member); // 변경된 비밀번호 저장
                tokenRepository.delete(token); // 사용된 토큰 삭제
                return true;
            }
        }
        return false;
    }

    // 사용자 이름으로 사용자 정보 찾기 메서드
    public Member findByUsername(String username) {
        return memberRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
    }

    // 닉네임으로 사용자 이름 찾기 메서드
    public String findUsernameByNickname(String nickname) {
        Optional<Member> member = memberRepository.findByNickname(nickname);
        return member.map(Member::getUsername).orElse(null);
    }

    // 이메일 인증 여부 확인 메서드
    public boolean isEmailVerified(String username) {
        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
        return member.isEnabled();
    }

    // 사용자 정보 가져오기 메서드
    public UserInfo getUserInfo(String username) {
        Member member = memberRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        return new UserInfo(member.getUsername(), member.getNickname());
    }
}
