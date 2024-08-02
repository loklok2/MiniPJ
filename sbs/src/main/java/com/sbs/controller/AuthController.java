package com.sbs.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.domain.Member;
import com.sbs.domain.SignupRequest;
import com.sbs.service.MemberService;

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
}
