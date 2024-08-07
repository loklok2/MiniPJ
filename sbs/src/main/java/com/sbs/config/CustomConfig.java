package com.sbs.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

// @Configuration 애너테이션은 이 클래스가 스프링의 설정 클래스임을 나타냅니다.
// 스프링이 이 클래스를 로드하면서 내부에 정의된 @Bean 메서드들을 관리하게 됩니다.
@Configuration
public class CustomConfig {

    // @Bean 애너테이션은 스프링 컨텍스트에 의해 관리될 수 있는 객체(Bean)를 생성하는 메서드에 붙입니다.
    // 이 메서드가 반환하는 객체는 애플리케이션 내에서 주입될 수 있습니다.
    @Bean
    PasswordEncoder passwordEncoder() {
        // BCryptPasswordEncoder는 비밀번호를 암호화할 때 사용되는 클래스입니다.
        // 이 메서드는 BCryptPasswordEncoder의 인스턴스를 생성하여 반환합니다.
        // 이를 통해 애플리케이션에서 비밀번호를 안전하게 해싱하고 검증할 수 있습니다.
        return new BCryptPasswordEncoder();
    }
}
