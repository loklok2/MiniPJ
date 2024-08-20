package com.sbs.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.auth.domain.Member;
import com.sbs.auth.domain.MemberDTO;
import com.sbs.auth.service.MemberService;

@RestController
@RequestMapping("/api/oauth2")
public class OAuth2Controller {
	
	@Autowired
	private MemberService memberService;
	
	@PostMapping("/sign")
	public ResponseEntity<?> saveAddinfo(@RequestBody MemberDTO memberDTO) {
		Member updateMember = memberService.updateAdditionalInfo(memberDTO);
		
		if (updateMember != null) {
			return ResponseEntity.ok(updateMember);
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("추가 정보 업데이트에 실패했습니다.");
		}
	}
	
	
	

}
