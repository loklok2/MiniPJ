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
        log.info("OAuth2SuccessHandler:onAuthenticationSuccess");

        OAuth2User user = (OAuth2User) authentication.getPrincipal();
        
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
            
            Member newMember = Member.builder()
                    .username(username)
                    .password(encoder.encode("1a2s3d4f"))
                    .enabled(true)
                    .role(Role.ROLE_MEMBER)
                    .build();
            
            memberRepo.save(newMember);
        }

        String jwtToken = JWTUtil.getJWT(username);
        response.addHeader(HttpHeaders.AUTHORIZATION, jwtToken); 
    }
}
