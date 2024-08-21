package com.sbs.auth.security;

import java.io.IOException;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sbs.auth.domain.Member;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    
    private final AuthenticationManager authenticationManager;
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        // 로그인 시도 시 사용자 인증을 처리합니다.
        ObjectMapper mapper = new ObjectMapper();
        
        try {
            Member member = mapper.readValue(request.getInputStream(), Member.class);
            Authentication authToken = new UsernamePasswordAuthenticationToken(member.getUsername(), member.getPassword());
            return authenticationManager.authenticate(authToken);
        } catch(Exception e) {
            log.info(e.getMessage());
        }
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        return null;
    }

    @Override
    public void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        // 인증 성공 후 JWT 토큰을 생성하고 응답 헤더에 추가합니다.
        User user = (User)authResult.getPrincipal();
        String token = JWT.create()
                          .withExpiresAt(new Date(System.currentTimeMillis() + 30 * 60 * 1000)) //30분
                          .withClaim("username", user.getUsername())
                          .sign(Algorithm.HMAC256(jwtSecret));
        response.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token);
        response.setStatus(HttpStatus.OK.value());
    }
}
