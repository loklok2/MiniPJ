package com.sbs.auth.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.auth.domain.FindUsernameRequest;
import com.sbs.auth.domain.Member;
import com.sbs.auth.domain.ResetPasswordRequest;
import com.sbs.auth.domain.SignupRequest;
import com.sbs.auth.service.EmailService;
import com.sbs.auth.service.MemberService;
import com.sbs.util.JWTUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<Member> signup(@RequestBody SignupRequest signupRequest){
        // 회원가입 요청을 처리합니다.
        Member member = memberService.registerUser(signupRequest);
        return new ResponseEntity<>(member, HttpStatus.CREATED);
    }

    @GetMapping("/verify")
    public ResponseEntity<String> veifyEmail(@RequestParam("token") String token){
        // 이메일 인증 요청을 처리합니다.
        boolean isVerified = memberService.verifyEmail(token);

        return isVerified ?
                new ResponseEntity<>("Email verified successfully", HttpStatus.OK) :
                new ResponseEntity<>("Invalid or expired verification token", HttpStatus.BAD_REQUEST);
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean isResetLinkSent = memberService.createPasswordResetToken(request.getUsername());
        return isResetLinkSent ?
                new ResponseEntity<>("Password reset link sent.", HttpStatus.OK) :
                new ResponseEntity<>("No account found with that username.", HttpStatus.NOT_FOUND);
    }
    

    @PostMapping("/reset-password-form")
    public ResponseEntity<?> updatePassword(@RequestBody ResetPasswordRequest request) {
        boolean isPasswordReset = memberService.resetPassword(request.getToken(), request.getNewPassword());
        return isPasswordReset ?
                ResponseEntity.ok("Password has been reset successfully.") :
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token.");
    }

    @PostMapping("/find-usernickname")
    public ResponseEntity<String> findUsername(@RequestBody FindUsernameRequest request) {
        String username = memberService.findUsernameByNickname(request.getNickname());
        return username != null ?
                new ResponseEntity<>(username, HttpStatus.OK) :
                new ResponseEntity<>("No account found with that nickname.", HttpStatus.NOT_FOUND);
    }
    
}
