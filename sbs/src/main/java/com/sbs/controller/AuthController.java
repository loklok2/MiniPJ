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

import com.sbs.domain.Member;
import com.sbs.domain.SignupRequest;
import com.sbs.service.MemberService;

@RestController // 이 클래스가 RESTful 웹 서비스의 컨트롤러임을 나타냅니다.
@RequestMapping("/api/auth") // 이 컨트롤러의 기본 경로를 "/api/auth"로 설정합니다.
public class AuthController {

	@Autowired
	private MemberService memberService; // MemberService를 자동 주입합니다.

	// 회원가입 요청을 처리하는 메서드입니다.
	@PostMapping("/signup")
	public ResponseEntity<Member> signup(@RequestBody SignupRequest signupRequest){
		// 회원가입 요청을 처리하고, 새로 생성된 회원 정보를 반환합니다.
		Member member = memberService.registerUser(signupRequest);
		// 회원가입이 성공하면, 201 Created 상태 코드와 함께 회원 정보를 응답합니다.
		return new ResponseEntity<>(member, HttpStatus.CREATED);
	}

	// 이메일 인증 요청을 처리하는 메서드입니다.
	@GetMapping("/verify")
	public ResponseEntity<String> veifyEmail(@RequestParam("token") String token){
		// 이메일 인증 토큰을 검증하고 결과를 반환합니다.
		boolean isVerified = memberService.verifyEmail(token);

		if(isVerified) {
			// 인증이 성공하면 200 OK 상태 코드와 함께 성공 메시지를 응답합니다.
			return new ResponseEntity<>("Email verified successfully", HttpStatus.OK);
		} else {
			// 인증이 실패하면 400 Bad Request 상태 코드와 함께 오류 메시지를 응답합니다.
			return new ResponseEntity<>("Invalid or expired verification token", HttpStatus.BAD_REQUEST);
		}
	}
}
