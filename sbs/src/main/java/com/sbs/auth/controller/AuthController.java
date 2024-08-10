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

        if(isVerified) {
            return new ResponseEntity<>("Email verified successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid or expired verification token", HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/find-usernickname")
    public ResponseEntity<String> findUsername(@RequestBody FindUsernameRequest request) {
        // 닉네임을 기반으로 사용자명을 찾습니다.
        String username = memberService.findUsernameByNickname(request.getNickname());

        if (username != null) {
            return new ResponseEntity<>(username, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No account found with that email and nickname.", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        // 비밀번호 재설정 링크를 생성하여 이메일로 전송합니다.
        boolean isResetLinkSent = memberService.createPasswordResetToken(request.getUsername());

        if (isResetLinkSent) {
            return new ResponseEntity<>("Password reset link sent.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No account found with that email address.", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/reset-password-form")
    public ResponseEntity<String> updatePassword(@RequestBody ResetPasswordRequest request) {
        // 비밀번호 재설정을 처리합니다.
        boolean isPasswordReset = memberService.resetPassword(request.getToken(), request.getNewPassword());

        if (isPasswordReset) {
            String newJwtToken = JWTUtil.getJWT(request.getUsername()); //비밀번호 재설정 시 새로운 토큰 발행
            return ResponseEntity.ok().header("Authorization", "Bearer " + newJwtToken)
                                 .body("Password has been reset successfully and new token generated.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("Invalid or expired token.");
        }
    }

    @PostMapping("/find-password")
    public ResponseEntity<String> findPassword(@RequestBody Map<String, String> request) {
        // 이메일을 통해 임시 비밀번호를 발급합니다.
        boolean isEmailSent = memberService.sendTemporaryPassword(request.get("username"));

        if (isEmailSent) {
            return new ResponseEntity<>("임시 비밀번호가 이메일로 전송되었습니다.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("이메일 정보 오류", HttpStatus.BAD_REQUEST);
        }
    }
}
