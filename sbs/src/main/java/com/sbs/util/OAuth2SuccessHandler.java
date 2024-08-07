package com.sbs.util;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.sbs.domain.Member;
import com.sbs.domain.Role;
import com.sbs.persistence.MemberRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j  // Lombok 애너테이션으로, 로깅을 위한 Logger 객체를 자동으로 생성합니다.
@RequiredArgsConstructor  // Lombok 애너테이션으로, final 필드에 대한 생성자를 자동으로 생성합니다.
@Component  // 이 클래스가 Spring의 빈으로 등록됨을 나타냅니다.
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final MemberRepository memberRepo;  // MemberRepository를 주입받아 사용합니다.
    private final PasswordEncoder encoder;  // PasswordEncoder를 주입받아 사용합니다.

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, 
                                         HttpServletResponse response, 
                                         Authentication authentication) throws IOException, ServletException {
        
        log.info("OAuth2SuccessHandler:onAuthenticationSuccess");  // 인증 성공 로그 출력

        // 인증된 사용자 정보를 OAuth2User 객체로 가져옵니다.
        OAuth2User user = (OAuth2User) authentication.getPrincipal();
        
        // CustomMyUtil을 사용하여 OAuth2User로부터 사용자명을 생성합니다.
        String username = CustomMyUtil.getUsernameFromOAuth2User(user);
        
        // 사용자명을 생성할 수 없는 경우 예외를 던집니다.
        if (username == null) {
            log.error("onAuthenticationSuccess: Cannot generate username from oauth2user!!");
            throw new ServletException("Cannot generate username from oauth2user!");
        }
        log.info("onAuthenticationSuccess:" + username);  // 생성된 사용자명을 로그로 출력

        // 새로운 회원을 생성하여 저장합니다. 비밀번호는 임의로 설정하고, 역할은 MEMBER로 설정합니다.
        memberRepo.save(Member.builder()
                .username(username)
                .password(encoder.encode("1a2s3d4f"))  // 비밀번호는 임의의 문자열로 설정
                .roles(Role.ROLE_MEMBER)
                .build());
        
        // 사용자명을 기반으로 JWT 토큰을 생성합니다.
        String jwtToken = JWTUtil.getJWT(username);
        
        // 응답 헤더에 JWT 토큰을 추가하여 클라이언트에게 반환합니다.
        response.addHeader(HttpHeaders.AUTHORIZATION, jwtToken); 
    }
}
