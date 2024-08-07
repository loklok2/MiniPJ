package com.sbs.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.domain.Member;
import com.sbs.service.MemberService;

@RestController
public class MypageController {
	
	@Autowired
	private MemberService memberService;
	
	@GetMapping
	public ResponseEntity<Member> getMyInfo(Authentication authentication){
		String username = authentication.getName();
		Member member = memberService.f
	}

}
