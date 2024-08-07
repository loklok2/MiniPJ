package com.sbs.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration 애너테이션은 이 클래스가 Spring의 설정 클래스임을 나타냅니다.
// 이 클래스는 스프링이 시작될 때 자동으로 로드됩니다.
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    // @NonNull은 이 메서드의 인수 registry가 null이 될 수 없음을 나타냅니다.
    // addCorsMappings 메서드는 CORS(Cross-Origin Resource Sharing) 설정을 위한 메서드입니다.
    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        // addMapping("/**")는 모든 경로에 대해 CORS를 허용하도록 설정합니다.
        registry.addMapping("/**")
            // allowedOrigins는 허용할 도메인을 지정합니다.
            // 여기서는 http://localhost:3000 도메인에서 오는 요청만 허용합니다.
            .allowedOrigins("http://localhost:3000")
            // allowedMethods는 허용할 HTTP 메서드를 지정합니다.
            // 여기서는 GET, POST, PUT, DELETE 메서드를 허용합니다.
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            // allowedHeaders는 허용할 HTTP 헤더를 지정합니다.
            // "*"는 모든 헤더를 허용한다는 의미입니다.
            .allowedHeaders("*")
            // allowCredentials는 쿠키 및 자격 증명을 포함한 요청을 허용할지를 결정합니다.
            // 여기서는 이를 허용하도록 설정되어 있습니다.
            .allowCredentials(true);
    }
}
