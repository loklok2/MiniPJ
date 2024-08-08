package com.sbs.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sbs.domain.Member;
import com.sbs.domain.Role;
import com.sbs.domain.SignupRequest;
import com.sbs.domain.UserInfo;
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
    

    //닉네임을 기반으로 아이디 찾기 메서드 // 8/7수정완료
    public String findUsernameByNickname(String nickname) {
        Optional<Member> member = memberRepository.findByNickname(nickname);
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
    
    //마이페이지 회원정보 이메일, 닉네임 메서드
    public UserInfo getUserInfo(String username) {
        Member member = memberRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserInfo(member.getUsername(), member.getNickname());
    }
    
    
 // 임시 비밀번호를 생성하여 사용자의 이메일로 전송하는 메서드, @param email 사용자 이메일, @return 임시 비밀번호 전송 성공 여부
 	public boolean sendTemporaryPassword(String email) {
 		Optional<Member> memberOptional = memberRepository.findByUsername(email);
 		
 		if (memberOptional.isPresent()) {
 			Member member = memberOptional.get();
 			String tempPassword = generateTemporaryPassword();
 			
 			// 임시 비밀번호를 암호화하여 저장
 			member.setPassword(passwordEncoder.encode(tempPassword));	// 비밀번호 암호화
 			memberRepository.save(member);								// 암호화된 임시비밀번호 저장
 			
 			// 임시 비밀번호를 이메일로 전송
             emailService.sendTemporaryPasswordEmail(email, tempPassword);
 			return true;
 		} else {
 			return false;			
 		}
 	}

     // 8자리의 임시 비밀번호를 생성하는 메서드, @return 임시 비밀번호
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
