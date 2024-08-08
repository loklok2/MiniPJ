package com.sbs.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

import com.sbs.util.OAuth2SuccessHandler;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

	// OAuth2 성공 핸들러를 주입
	private final OAuth2SuccessHandler successHandler;	

	
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.authorizeHttpRequests(authorize -> authorize
				// "/member/**" 경로는 인증된 사용자만 접근할 수 있도록 설정합니다.
				.requestMatchers("/member/**").authenticated()
				// "/manager/**" 경로는 "MANAGER" 또는 "ADMIN" 역할을 가진 사용자만 접근할 수 있도록 설정합니다.
				.requestMatchers("/manager/**").hasAnyRole("MANAGER", "ADMIN")
				// "/admin/**" 경로는 "ADMIN" 역할을 가진 사용자만 접근할 수 있도록 설정합니다.
				.requestMatchers("/admin/**").hasRole("ADMIN")
				//mypage 경로 접근 설정
				.requestMatchers("/api/mypage/**").authenticated()
				// 그 외의 모든 요청은 인증 없이 접근을 허용합니다.
				.anyRequest().permitAll())
		// CSRF 보호 기능을 비활성화합니다.
		.csrf(csrf -> csrf.disable())
		// 폼 로그인 설정을 구성합니다.
		.formLogin(form -> form.disable())
		// OAuth2 로그인 설정을 구성합니다.
		.oauth2Login(oauth2 -> oauth2
				.successHandler(successHandler));

		// 설정된 SecurityFilterChain을 반환합니다.
		return http.build();
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		// AuthenticationManager를 반환하는 메서드로, 인증 설정을 관리합니다.
		return authenticationConfiguration.getAuthenticationManager();
	}
}
