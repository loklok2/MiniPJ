package com.sbs.config;

import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;




public class CorsConfig implements WebMvcConfigurer {
	
	public void addCorsMappinds(@NonNull CorsRegistry registry) {
		registry.addMapping("/**")
        .allowedOrigins("http://localhost:3000") // 허용할 도메인
        .allowedMethods("GET", "POST", "PUT", "DELETE") // 허용할 HTTP 메서드
        .allowedHeaders("Authorization", "Content-Type") // 허용할 HTTP 헤더
        .allowCredentials(true); // 쿠키 및 자격 증명 허용
	}
}
