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
        
        log.info("OAuth2SuccessHandler:onAuthenticationSuccess");

        // 인증된 사용자 정보를 OAuth2User 객체로 가져옵니다.
        OAuth2User user = (OAuth2User) authentication.getPrincipal();
        
        // CustomMyUtil을 사용하여 OAuth2User로부터 사용자명을 생성합니다.
        String username = CustomMyUtil.getUsernameFromOAuth2User(user);
        
        if (username == null) {
            log.error("onAuthenticationSuccess: Cannot generate username from oauth2user!!");
            throw new ServletException("Cannot generate username from oauth2user!");
        }
        log.info("onAuthenticationSuccess:" + username);

        Optional<Member> existingMember = memberRepo.findByUsername(username);

        if (existingMember.isPresent()) {
            log.info("onAuthenticationSuccess: Existing user found with username: " + username);
        } else {
            log.info("onAuthenticationSuccess: New user created with username: " + username);
            
            // 새로운 회원을 생성하여 저장합니다.
            Member newMember = Member.builder()
                    .username(username)
                    .password(encoder.encode("1a2s3d4f"))  // 비밀번호는 임의의 문자열로 설정
                    .enabled(true)
                    .role(Role.ROLE_MEMBER)  // 단일 역할 설정
                    .build();
            
            memberRepo.save(newMember);
        }

        // 사용자명을 기반으로 JWT 토큰을 생성합니다.
        String jwtToken = JWTUtil.getJWT(username);
        
        // 응답 헤더에 JWT 토큰을 추가하여 클라이언트에게 반환합니다.
        response.addHeader(HttpHeaders.AUTHORIZATION, jwtToken); 
    }
}
