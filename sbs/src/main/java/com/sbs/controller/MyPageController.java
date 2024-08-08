package com.sbs.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.domain.Member;
import com.sbs.domain.UpdateMemberRequest;
import com.sbs.service.MemberService;

@RestController
@RequestMapping("/api/mypage")
public class MyPageController {

    @Autowired
    private MemberService memberService;

    // 로그인한 사용자의 정보를 가져오는 엔드포인트
    @GetMapping
    public ResponseEntity<Member> getMyInfo(Authentication authentication) {
        String username = authentication.getName();
        Member member = memberService.findByUsername(username);
        return new ResponseEntity<>(member, HttpStatus.OK);
    }

    // 회원 정보를 수정하는 엔드포인트
    @PutMapping
    public ResponseEntity<Member> updateMyInfo(@RequestBody UpdateMemberRequest updateRequest, Authentication authentication) {
        String username = authentication.getName();
        Member updatedMember = memberService.updateMemberInfo(username, updateRequest);
        return new ResponseEntity<>(updatedMember, HttpStatus.OK);
    }
}
