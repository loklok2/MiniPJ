package com.sbs.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.domain.UserInfo;
import com.sbs.service.MemberService;

@RestController
@RequestMapping("/api/mypage")
public class MyPageController {

    @Autowired
    private MemberService memberService;

    // 로그인한 사용자의 정보를 가져오는 엔드포인트
    @GetMapping
    public ResponseEntity<UserInfo> getMyInfo(Authentication authentication) {
        String username = authentication.getName();
        UserInfo userInfo = memberService.getUserInfo(username);
        return new ResponseEntity<>(userInfo, HttpStatus.OK);
    }

}
