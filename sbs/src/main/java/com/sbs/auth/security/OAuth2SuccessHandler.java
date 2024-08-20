package com.sbs.auth.security;

import java.io.IOException;
import java.util.Optional;

import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.sbs.auth.domain.Member;
import com.sbs.auth.domain.Role;
import com.sbs.auth.repository.MemberRepository;
import com.sbs.util.CustomMyUtil;
import com.sbs.util.JWTUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j  
@RequiredArgsConstructor 
@Component  
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final MemberRepository memberRepo;  
    private final PasswordEncoder encoder;  

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, 
                                         HttpServletResponse response, 
                                         Authentication authentication) throws IOException, ServletException {
        // OAuth2 로그인 성공 후 사용자 처리
        log.info("OAuth2SuccessHandler: 인증 성공 후 처리");

        // OAuth2User 객체에서 사용자 이름을 생성
        OAuth2User user = (OAuth2User) authentication.getPrincipal();
        String username = CustomMyUtil.getUsernameFromOAuth2User(user);

        if (username == null) {
            log.error("onAuthenticationSuccess: OAuth2 사용자로부터 사용자 이름을 생성할 수 없습니다!");
            throw new ServletException("OAuth2 사용자로부터 사용자 이름을 생성할 수 없습니다!");
        }
        log.info("onAuthenticationSuccess: 사용자 이름 " + username);

        // 데이터베이스에서 사용자 조회 또는 신규 사용자 생성
        Member member = memberRepo.findByUsername(username)
            .orElseGet(() -> {
                Member newMember = Member.builder()
                        .username(username)
                        .password(encoder.encode("1a2s3d4f")) // 임시 비밀번호 설정
                        .enabled(true) // 계정 활성화
                        .nickname(username) // 닉네임을 사용자 이름으로 설정
                        .role(Role.ROLE_MEMBER) // 기본 역할 설정
                        .build();
                return memberRepo.save(newMember);
            });

        // JWT 토큰 생성 및 응답 헤더에 추가
        String jwtToken = JWTUtil.getJWT(username);
        response.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken); 

        // 로그인 성공 후 홈 페이지로 리다이렉트
        response.sendRedirect("http://localhost:3000/");
    }
}
