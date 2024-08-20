package com.sbs.auth.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        // CORS 설정을 추가하는 메서드
        registry.addMapping("/**") // 모든 경로에 대해 CORS 설정 적용
            .allowedOrigins("http://localhost:3000") // 특정 도메인에서의 요청을 허용
            .allowedMethods("GET", "POST", "PUT", "DELETE") // 허용할 HTTP 메서드 지정
            .allowedHeaders("*") // 모든 헤더를 허용
            .allowCredentials(true); // 자격 증명(쿠키, Authorization 헤더 등) 포함 허용
    }
}
