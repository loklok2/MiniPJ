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
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authorize -> authorize
                // 경로별로 인증 및 권한을 설정
                .requestMatchers("/api/auth/**").permitAll() // 인증 관련 API는 누구나 접근 가능
                .requestMatchers("/api/login").permitAll() // 로그인 API는 누구나 접근 가능
                .requestMatchers("/api/mypage/**").authenticated() // 마이페이지 관련 API는 인증된 사용자만 접근 가능
                .requestMatchers("/api/boards/public/**").permitAll() // 게시글 조회는 누구나 접근 가능
                .requestMatchers("/api/boards/{id}").permitAll() // 특정 게시글 조회는 누구나 접근 가능
                .requestMatchers("/api/boards/**").authenticated() // 게시글 작성, 수정, 삭제는 인증된 사용자만 접근 가능
                .requestMatchers("/api/comments/**").authenticated() // 댓글 작성, 수정, 삭제, 좋아요는 인증된 사용자만 접근 가능
                .requestMatchers("/api/locations/**").permitAll() // 위치 정보 관련 API는 누구나 접근 가능
                .requestMatchers("/api/tourtrans/**").permitAll() // 관광지 정보 관련 API는 누구나 접근 가능
                .anyRequest().permitAll()) // 그 외의 경로는 모두 접근 가능하게 설정
            .formLogin(form -> form.disable()) // 기본 로그인 페이지 사용 안함
            .oauth2Login(oauth2 -> oauth2.successHandler(successHandler)) // OAuth2 로그인 성공 핸들러 설정
            .addFilterBefore(new JWTAuthorizationFilter(memberRepository), UsernamePasswordAuthenticationFilter.class);  // JWT 필터 추가

		return http.build();
	}

	@Bean
	AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
		// 기본 인증 제공자를 사용하여 AuthenticationManager 설정
		return http.getSharedObject(AuthenticationManagerBuilder.class).build();
	}
}
