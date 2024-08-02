package edu.pnu.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import edu.pnu.util.OAuth2SuccessHandler;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {
//	@Bean
//	PasswordEncoder passwordEncoder() {
//		return new BCryptPasswordEncoder();
//	}
	
	private final OAuth2SuccessHandler successHandler;	
	
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
		http.authorizeHttpRequests(security->security  //접근권한 설정
				.requestMatchers("/member/**").authenticated()
				.requestMatchers("/manager/**").hasAnyRole("MANAGER","ADMIN")
				.requestMatchers("/admin/**").hasRole("ADMIN")
				.anyRequest().permitAll());
		
		
		http.csrf(cf->cf.disable()); //csrf 보호 비활성화(사이트간 요청 위조) 지금은 사용하지 않아서 disable
		
		
		http.formLogin(form-> form.loginPage("/login").defaultSuccessUrl("/loginSuccess", true));
		
		http.logout(logout->logout
			.invalidateHttpSession(true)
				.deleteCookies("JSESSIONID")
				.logoutSuccessUrl("/login"));
		
		http.oauth2Login(oauth2->oauth2
				.loginPage("/login")
				.successHandler(successHandler));
//				.defaultSuccessUrl("/loginSuccess", true));
		
		http.headers(hr->hr.frameOptions(fo->fo.disable()));
		
//		http.sessionManagement(sm->sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
//		http.oauth2Login(oauth2->oauth2.successHandler(successHandler));
		
		return http.build();
	}
		
	

}
