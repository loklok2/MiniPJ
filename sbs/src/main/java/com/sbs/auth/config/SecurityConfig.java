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
                .requestMatchers("/api/mypage/**", "/api/boards/**","/api/comments/**" ).authenticated()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/boards/public/**").permitAll()
                .anyRequest().permitAll())
            .formLogin(form -> form.disable())
            .oauth2Login(oauth2 -> oauth2.successHandler(successHandler))
            .addFilterBefore(new JWTAuthorizationFilter(memberRepository), UsernamePasswordAuthenticationFilter.class);  // JWT 필터 추가

        return http.build();
    }

    @Bean
    AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        // 기본 인증 제공자를 사용하여 AuthenticationManager 설정
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .build();
    }
}
