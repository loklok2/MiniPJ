package com.sbs.config.filter;

import java.io.IOException;
import java.util.Date;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sbs.domain.Member;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// @RequiredArgsConstructor 애너테이션은 final 필드에 대해 생성자를 자동으로 생성합니다.
// @Slf4j 애너테이션은 로깅을 위한 Lombok 애너테이션으로, 로그를 쉽게 사용할 수 있게 합니다.
@RequiredArgsConstructor
@Slf4j
public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
	
	// 인증을 처리하는 객체로, 인증 요청을 관리합니다.
	private final AuthenticationManager authenticationManager;
	
	// 사용자가 POST /login 요청을 보낼 때, 인증을 시도하는 메서드입니다.
	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
		
		ObjectMapper mapper = new ObjectMapper();
		
		try {
			// 요청의 입력 스트림에서 Member 객체를 읽어들입니다.
			Member member = mapper.readValue(request.getInputStream(), Member.class);
			
			// 사용자의 이름과 비밀번호로 인증 토큰을 생성합니다.
			Authentication authToken = new UsernamePasswordAuthenticationToken(member.getUsername(), member.getPassword());
			
			// AuthenticationManager를 통해 인증을 시도합니다.
			return authenticationManager.authenticate(authToken);
		} catch(Exception e) {
			// 예외 발생 시 로그에 오류 메시지를 기록합니다.
			log.info(e.getMessage()); 
		}
		// 인증 실패 시 HTTP 응답 상태를 401 Unauthorized로 설정합니다.
		response.setStatus(HttpStatus.UNAUTHORIZED.value()); 
		return null;
	}
	
	// 인증이 성공적으로 완료된 후에 실행되는 메서드입니다.
	@Override
	public void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
		
		// 인증 결과에서 사용자 정보를 가져옵니다.
		User user = (User)authResult.getPrincipal();
		
		// JWT 토큰을 생성합니다.
		String token = JWT.create()
<<<<<<< HEAD
						.withExpiresAt(new Date(System.currentTimeMillis()+1000*60*100))
=======
						// 토큰의 만료 시간을 설정합니다.
						.withExpiresAt(new Date(System.currentTimeMillis()+1000*60*100))
						// 토큰에 사용자 이름을 클레임으로 추가합니다.
>>>>>>> 39f029607ac6fbf2f2b70ef3312d7de8be263b46
						.withClaim("username", user.getUsername())
						// HMAC 알고리즘을 사용하여 토큰을 서명합니다.
						.sign(Algorithm.HMAC256("edu.pnu.jwt"));
		
		// 생성된 JWT 토큰을 Authorization 헤더에 추가합니다.
		response.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token);
		// 응답 상태를 200 OK로 설정합니다.
		response.setStatus(HttpStatus.OK.value());
	}
}
