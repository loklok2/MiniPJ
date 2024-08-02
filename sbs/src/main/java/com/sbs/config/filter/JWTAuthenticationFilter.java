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
import com.sbs.util.JWTUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
	
	//인증객체
	private final AuthenticationManager authenticationManager;
	
	
	//POST/login 요청이 왔을 때 인증을 시도하는 메소드
	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException{
		
		ObjectMapper mapper = new ObjectMapper();
		
		try {
			Member member = mapper.readValue(request.getInputStream(), Member.class);
			
			Authentication authToken = new UsernamePasswordAuthenticationToken(member.getUsername(), member.getPassword());
		
			return authenticationManager.authenticate(authToken);
		} catch(Exception e) {
			log.info(e.getMessage()); 
		}
		response.setStatus(HttpStatus.UNAUTHORIZED.value()); 
		return null;
	}
	//인증이 성공했을 때 실행되는 후처리 메소드
	@Override
	public void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
		

		User user = (User)authResult.getPrincipal();
		
//		String token = JWT.create()
//						.withExpiresAt(new Date(System.currentTimeMillis()+1000*60*10))
//						.withClaim("username", user.getUsername())
//						.sign(Algorithm.HMAC256("edu.pnu.jwt"));
		response.addHeader(HttpHeaders.AUTHORIZATION, JWTUtil.getJWT(user.getUsername()));
		response.setStatus(HttpStatus.OK.value());
	
	}
	
}
