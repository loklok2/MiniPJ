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

import com.sbs.auth.domain.Member;
import com.sbs.auth.domain.MemberDTO;
import com.sbs.auth.service.MemberService;
import com.sbs.util.JWTUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<Member> signup(@RequestBody MemberDTO memberDTO){
        Member member = memberService.registerUser(memberDTO);
        return new ResponseEntity<>(member, HttpStatus.CREATED);
    }

    @GetMapping("/verify")
    public ResponseEntity<String> veifyEmail(@RequestParam("token") String token){
        boolean isVerified = memberService.verifyEmail(token);

        return isVerified ?
                new ResponseEntity<>("Email verified successfully", HttpStatus.OK) :
                new ResponseEntity<>("Invalid or expired verification token", HttpStatus.BAD_REQUEST);
    }
    
    @PostMapping("/find-usernickname")
    public ResponseEntity<String> findUsername(@RequestBody MemberDTO memberDTO) {
        String username = memberService.findUsernameByNickname(memberDTO.getNickname());

        if (username != null) {
            return new ResponseEntity<>(username, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No account found with that email and nickname.", HttpStatus.NOT_FOUND);
        }
    
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody MemberDTO memberDTO) {
        boolean isResetLinkSent = memberService.createPasswordResetToken(memberDTO.getUsername());

        if (isResetLinkSent) {
            return new ResponseEntity<>("Password reset link sent.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No account found with that email address.", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/reset-password-form")
    public ResponseEntity<String> updatePassword(@RequestBody MemberDTO memberDTO) {
        boolean isPasswordReset = memberService.resetPassword(memberDTO.getToken(), memberDTO.getNewPassword());

        if (isPasswordReset) {
            String newJwtToken = JWTUtil.getJWT(memberDTO.getUsername()); // 비밀번호 재설정 시 새로운 토큰 발행
            return ResponseEntity.ok().header("Authorization", "Bearer " + newJwtToken)
                                 .body("Password has been reset successfully and new token generated.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("Invalid or expired token.");
        }
    }
}
