package com.sbs.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.sbs.config.filter.JWTAuthorizationFilter;
import com.sbs.persistence.MemberRepository;
import com.sbs.security.CustomAuthenticationProvider;
import com.sbs.util.OAuth2SuccessHandler;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final OAuth2SuccessHandler successHandler;
	private final CustomAuthenticationProvider customAuthenticationProvider;
	private final MemberRepository memberRepository;  // JWTAuthorizationFilter에서 사용

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable())
		    .authorizeHttpRequests(authorize -> authorize
				.requestMatchers("/member/**").authenticated()
				.requestMatchers("/manager/**").hasAnyRole("MANAGER", "ADMIN")
				.requestMatchers("/admin/**").hasRole("ADMIN")
				.requestMatchers("/api/mypage/**").authenticated()
				.anyRequest().permitAll())
		    .formLogin(form -> form.disable())
		    .oauth2Login(oauth2 -> oauth2.successHandler(successHandler))
		    .addFilterBefore(new JWTAuthorizationFilter(memberRepository), UsernamePasswordAuthenticationFilter.class);  // JWT 필터 추가

		return http.build();
	}

	@Bean
	AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
		return http.getSharedObject(AuthenticationManagerBuilder.class)
				.authenticationProvider(customAuthenticationProvider)
				.build();
	}
}
