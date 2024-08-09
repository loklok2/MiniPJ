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
    
 // 닉네임 기반으로 아이디 찾기
    @PostMapping("/find-usernickname")
    public ResponseEntity<String> findUsername(@RequestBody FindUsernameRequest request) {
        String nickname = request.getNickname();
    	
    	String username = memberService.findUsernameByNickname(nickname);

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
            String newJwtToken = JWTUtil.getJWT(request.getUsername()); //비밀번호 재설정 시 새로운 토큰 발행
            return ResponseEntity.ok().header("Authorization", "Bearer " + newJwtToken)
                                 .body("Password has been reset successfully and new token generated.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("Invalid or expired token.");
        }
    }
   
    // 이메일을 기반으로 비밀번호 찾기
    @PostMapping("/find-password")
    public ResponseEntity<String> findPassword(@RequestBody Map<String, String> request) {
    	String email = request.get("username");
    	boolean isEmailSent = memberService.sendTemporaryPassword(email);
    	
    	if (isEmailSent) {
    		return new ResponseEntity<>("임시 비밀번호가 이메일로 전송되었습니다.", HttpStatus.OK);
    	} else {
    		return new ResponseEntity<>("이메일 정보 오류", HttpStatus.BAD_REQUEST);
    	}
    }
}

