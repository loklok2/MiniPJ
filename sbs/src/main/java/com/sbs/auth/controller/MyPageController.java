package com.sbs.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.auth.domain.UserInfo;
import com.sbs.auth.service.MemberService;

@RestController
@RequestMapping("/api/mypage")
public class MyPageController {

    @Autowired
    private MemberService memberService;

    @GetMapping("/info")
    public ResponseEntity<UserInfo> getMyInfo(Authentication authentication) {
        // 현재 로그인된 사용자의 정보를 반환합니다.
        String username = authentication.getName();
        UserInfo userInfo = memberService.getUserInfo(username);
        return new ResponseEntity<>(userInfo, HttpStatus.OK);
    }
}
