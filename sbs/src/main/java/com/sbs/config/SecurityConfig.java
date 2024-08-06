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

// @RequiredArgsConstructor는 Lombok 애너테이션으로, final로 선언된 필드를 인수로 받는 생성자를 자동으로 생성합니다.
// @Configuration은 이 클래스가 스프링의 설정 클래스임을 나타내고,
// @EnableWebSecurity는 스프링 시큐리티 설정을 활성화합니다.
@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

	// OAuth2 성공 핸들러를 주입받는 final 필드입니다.
	private final OAuth2SuccessHandler successHandler;	

	// 스프링 시큐리티의 필터 체인을 구성하는 Bean을 정의합니다.
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.authorizeHttpRequests(authorize -> authorize
				// "/member/**" 경로는 인증된 사용자만 접근할 수 있도록 설정합니다.
				.requestMatchers("/member/**").authenticated()
				// "/manager/**" 경로는 "MANAGER" 또는 "ADMIN" 역할을 가진 사용자만 접근할 수 있도록 설정합니다.
				.requestMatchers("/manager/**").hasAnyRole("MANAGER", "ADMIN")
				// "/admin/**" 경로는 "ADMIN" 역할을 가진 사용자만 접근할 수 있도록 설정합니다.
				.requestMatchers("/admin/**").hasRole("ADMIN")
				// 그 외의 모든 요청은 인증 없이 접근을 허용합니다.
				.anyRequest().permitAll())
		// CSRF 보호 기능을 비활성화합니다.
		.csrf(csrf -> csrf.disable())
		// 폼 로그인 설정을 구성합니다.
		.formLogin(form -> form
				// 커스텀 로그인 페이지 경로를 설정합니다.
				.loginPage("/login")
				// 로그인 성공 시 리다이렉트할 기본 URL을 설정합니다.
				.defaultSuccessUrl("/loginSuccess", true))
		// 로그아웃 설정을 구성합니다.
		.logout(logout -> logout
				// 세션을 무효화하고 JSESSIONID 쿠키를 삭제합니다.
				.invalidateHttpSession(true)
				.deleteCookies("JSESSIONID")
				// 로그아웃 성공 시 리다이렉트할 URL을 설정합니다.
				.logoutSuccessUrl("/login"))
		// OAuth2 로그인 설정을 구성합니다.
		.oauth2Login(oauth2 -> oauth2
				// OAuth2 로그인 페이지 경로를 설정합니다.
				.loginPage("/login")
				// OAuth2 로그인 성공 시 커스텀 핸들러를 사용합니다.
				.successHandler(successHandler));

		// 설정된 SecurityFilterChain을 반환합니다.
		return http.build();
	}

	// AuthenticationManager Bean을 정의합니다.
	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		// AuthenticationManager를 반환하는 메서드로, 인증 설정을 관리합니다.
		return authenticationConfiguration.getAuthenticationManager();
	}
}
