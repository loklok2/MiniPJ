package com.sbs.auth.controller;

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
        Member member = memberService.registerUser(signupRequest);
        return new ResponseEntity<>(member, HttpStatus.CREATED);
    }

    @GetMapping("/verify")
    public ResponseEntity<String> veifyEmail(@RequestParam("token") String token){
        boolean isVerified = memberService.verifyEmail(token);

        if(isVerified) {
            return new ResponseEntity<>("Email verified successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid or expired verification token", HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/find-usernickname")
    public ResponseEntity<String> findUsername(@RequestBody FindUsernameRequest request) {
        String username = memberService.findUsernameByNickname(request.getNickname());

        if (username != null) {
            return new ResponseEntity<>(username, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No account found with that email and nickname.", HttpStatus.NOT_FOUND);
        }
    

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean isResetLinkSent = memberService.createPasswordResetToken(request.getUsername());

        if (isResetLinkSent) {
            return new ResponseEntity<>("Password reset link sent.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No account found with that email address.", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/reset-password-form")
    public ResponseEntity<String> updatePassword(@RequestBody ResetPasswordRequest request) {
        boolean isPasswordReset = memberService.resetPassword(request.getToken(), request.getNewPassword());

        if (isPasswordReset) {
            String newJwtToken = JWTUtil.getJWT(request.getUsername()); // 비밀번호 재설정 시 새로운 토큰 발행
            return ResponseEntity.ok().header("Authorization", "Bearer " + newJwtToken)
                                 .body("Password has been reset successfully and new token generated.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("Invalid or expired token.");
        }
    }
}
