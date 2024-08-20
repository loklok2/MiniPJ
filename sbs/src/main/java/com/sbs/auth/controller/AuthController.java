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
    
    // 회원가입 처리 메서드
    @PostMapping("/signup")
    public ResponseEntity<Member> signup(@RequestBody MemberDTO memberDTO){
        // 회원가입 요청을 처리하고 새로운 사용자(Member)를 생성
        Member member = memberService.registerUser(memberDTO);
        return new ResponseEntity<>(member, HttpStatus.CREATED); // 생성된 사용자와 함께 HTTP 201 응답
    }
    
    // 이메일 인증 처리 메서드
    @GetMapping("/verify")
    public ResponseEntity<String> veifyEmail(@RequestParam("token") String token){
        // 이메일 인증 토큰을 검증하고 인증 상태를 업데이트
        boolean isVerified = memberService.verifyEmail(token);

        return isVerified ?
                new ResponseEntity<>("이메일 인증이 성공적으로 완료 되었습니다.", HttpStatus.OK) :
                new ResponseEntity<>("유효하지 않거나, 만료된 인증 토큰입니다.", HttpStatus.BAD_REQUEST);
    }
    
    // 닉네임을 기반으로 사용자 이름 찾기 메서드
    @PostMapping("/find-usernickname")
    public ResponseEntity<String> findUsername(@RequestBody MemberDTO memberDTO) {
        // 닉네임을 통해 사용자 이름(username)을 찾음
        String username = memberService.findUsernameByNickname(memberDTO.getNickname());

        if (username != null) {
            return new ResponseEntity<>(username, HttpStatus.OK); // 사용자 이름 반환
        } else {
            return new ResponseEntity<>("해당 이메일과 닉네임으로 등록된 계정을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
        }
    }
    
    // 비밀번호 재설정 링크 요청 처리 메서드
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody MemberDTO memberDTO) {
        // 비밀번호 재설정 토큰을 생성하고 이메일로 전송
        boolean isResetLinkSent = memberService.createPasswordResetToken(memberDTO.getUsername());

        if (isResetLinkSent) {
            return new ResponseEntity<>("비밀번호 재설정 링크가 전송되었습니다.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("해당 이메일 주소로 등록된 계정을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
        }
    }

    // 비밀번호 재설정 처리 메서드
    @PostMapping("/reset-password-form")
    public ResponseEntity<String> updatePassword(@RequestBody MemberDTO memberDTO) {
        // 재설정 토큰을 사용하여 비밀번호를 업데이트
        boolean isPasswordReset = memberService.resetPassword(memberDTO.getToken(), memberDTO.getNewPassword());

        if (isPasswordReset) {
            // 비밀번호 재설정 성공 시, 새로운 JWT 토큰을 생성하여 반환
            String newJwtToken = JWTUtil.getJWT(memberDTO.getUsername()); // 비밀번호 재설정 시 새로운 토큰 발행
            return ResponseEntity.ok().header("Authorization", "Bearer " + newJwtToken)
                                 .body("비밀번호가 성공적으로 재설정되었으며, 새로운 토큰이 생성되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("유효하지 않거나 만료된 토큰입니다.");
        }
    }
}
