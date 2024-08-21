package com.sbs.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.sbs.auth.repository.MemberRepository;
import com.sbs.auth.security.JWTAuthorizationFilter;
import com.sbs.auth.security.OAuth2SuccessHandler;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final OAuth2SuccessHandler successHandler; 
    private final MemberRepository memberRepository;  
    
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable()) // CSRF 보호 비활성화
            .authorizeHttpRequests(authorize -> authorize
                // 경로별로 인증 및 권한 설정
                .requestMatchers("/api/auth/**").permitAll() // 인증 관련 API 접근 허용
                .requestMatchers("/api/login").permitAll() // 로그인 API 접근 허용
                .requestMatchers("/api/mypage/**").authenticated() // 마이페이지 API 접근 인증 필요
                .requestMatchers("/api/boards/public/**").permitAll() // 공개 게시글 조회 API 접근 허용
                .requestMatchers("/api/boards/{id}").permitAll() // 특정 게시글 조회 API 접근 허용
                .requestMatchers("/api/boards/**").authenticated() // 게시글 작성, 수정, 삭제 접근 인증 필요
                .requestMatchers("/api/images/**").permitAll() // 이미지 API 접근 허용
                .requestMatchers("/api/comments/public/**").permitAll() // 댓글 조회 API 접근 허용
                .requestMatchers("/api/comments/create").authenticated() // 댓글 작성 접근 인증 필요
                .requestMatchers("/api/comments/{id}/**").authenticated() // 댓글 수정 및 삭제 접근 인증 필요
                .requestMatchers("/api/locations/**").permitAll() // 위치 정보 API 접근 허용
                .requestMatchers("/api/tourtrans/**").permitAll() // 관광 정보 API 접근 허용
                .anyRequest().permitAll()) // 그 외 모든 요청 접근 허용
            .formLogin(form -> form.disable()) // 기본 로그인 페이지 비활성화
            .oauth2Login(oauth2 -> oauth2.successHandler(successHandler)) // OAuth2 로그인 성공 핸들러 설정
            .addFilterBefore(new JWTAuthorizationFilter(memberRepository), UsernamePasswordAuthenticationFilter.class); // JWT 필터 추가 (UsernamePasswordAuthenticationFilter 이전)

        return http.build(); // SecurityFilterChain 빌드 및 반환
    }

    @Bean
    AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        // 기본 인증 제공자를 사용하여 AuthenticationManager 설정 및 반환
        return http.getSharedObject(AuthenticationManagerBuilder.class).build();
    }
}
