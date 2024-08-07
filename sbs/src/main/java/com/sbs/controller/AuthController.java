package com.sbs.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.domain.FindUsernameRequest;
import com.sbs.domain.Member;
import com.sbs.domain.ResetPasswordRequest;
import com.sbs.domain.SignupRequest;
import com.sbs.service.MemberService;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private MemberService memberService;

    // 회원가입 요청을 처리하는 메서드입니다.
    @PostMapping("/signup")
    public ResponseEntity<Member> signup(@RequestBody SignupRequest signupRequest){
        Member member = memberService.registerUser(signupRequest);
        return new ResponseEntity<>(member, HttpStatus.CREATED);
    }

    // 이메일 인증 요청을 처리하는 메서드입니다.
    @GetMapping("/verify")
    public ResponseEntity<String> veifyEmail(@RequestParam("token") String token){
        boolean isVerified = memberService.verifyEmail(token);

        if(isVerified) {
            return new ResponseEntity<>("Email verified successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid or expired verification token", HttpStatus.BAD_REQUEST);
        }
    }
    
 // 이메일과 닉네임을 기반으로 아이디 찾기
    @PostMapping("/find-username")
    public ResponseEntity<String> findUsername(@RequestBody FindUsernameRequest request) {
        String email = request.getEmail();
        String nickname = request.getNickname();
    	
    	String username = memberService.findUsernameByEmailAndNickname(email, nickname);

        if (username != null) {
            return new ResponseEntity<>(username, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No account found with that email and nickname.", HttpStatus.NOT_FOUND);
        }
    }

    // 비밀번호 재설정 요청 처리
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean isResetLinkSent = memberService.createPasswordResetToken(request.getUsername());

        if (isResetLinkSent) {
            return new ResponseEntity<>("Password reset link sent.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No account found with that email address.", HttpStatus.NOT_FOUND);
        }
    }

    // 비밀번호 재설정 처리
    @PostMapping("/reset-password-form")
    public ResponseEntity<String> updatePassword(@RequestBody ResetPasswordRequest request) {
        boolean isPasswordReset = memberService.resetPassword(request.getToken(), request.getNewPassword());

        if (isPasswordReset) {
            return new ResponseEntity<>("Password has been reset successfully.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid or expired token.", HttpStatus.BAD_REQUEST);
        }
    }
   
}

