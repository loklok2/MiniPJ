package com.sbs.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class CustomConfig {

    @Bean
    PasswordEncoder passwordEncoder() {
        // 비밀번호를 암호화하는 BCryptPasswordEncoder 빈 생성
        return new BCryptPasswordEncoder();
    }
}
