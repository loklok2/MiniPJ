package com.sbs.config.filter;

import java.io.IOException;
import java.util.Optional;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.sbs.domain.Member;
import com.sbs.persistence.MemberRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

// @RequiredArgsConstructor는 final 필드에 대한 생성자를 자동으로 생성합니다.
// OncePerRequestFilter를 상속받은 필터는 각 요청에 대해 한 번만 실행됩니다.
// 이 필터는 인증 토큰을 검사하고, 유효한 경우 사용자 정보를 설정합니다.
@RequiredArgsConstructor
public class JWTAuthorizationFilter extends OncePerRequestFilter { //httpservlet필터

	// 사용자의 Role 정보를 읽어들이기 위해 MemberRepository를 주입받습니다.
	private final MemberRepository memberRepository;

	// 각 요청에 대해 필터를 수행하는 메서드입니다.
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		// 요청 헤더에서 Authorization 값을 가져옵니다.
		String srcToken = request.getHeader("Authorization"); 
		// 토큰이 없거나 "Bearer "로 시작하지 않으면 필터를 통과시킵니다.
		if(srcToken == null || !srcToken.startsWith("Bearer ")) { 
			filterChain.doFilter(request, response); 
			return;			
		}
		// "Bearer " 접두사를 제거하여 실제 JWT 토큰을 추출합니다.
		String jwtToken = srcToken.replace("Bearer ", ""); 
		
		// JWT 토큰에서 username 클레임을 추출합니다.
		String username = JWT.require(Algorithm.HMAC256("edu.pnu.jwtkey")).build().verify(jwtToken).getClaim("username").asString();
		
		// 추출한 username으로 DB에서 사용자 정보를 검색합니다.
		Optional<Member> opt = memberRepository.findByUsername(username); 
		// 사용자가 존재하지 않는다면 필터를 통과시킵니다.
		if(!opt.isPresent()) { 
			filterChain.doFilter(request, response); 
			return;
		}
		
		// DB에서 찾은 사용자 정보를 가져옵니다.
		Member findMember = opt.get();
		
		// DB에서 읽은 사용자 정보를 기반으로 UserDetails 객체를 생성합니다.
		User user = new User(findMember.getUsername(), findMember.getPassword(), 
				AuthorityUtils.createAuthorityList(findMember.getRoles().toString()));
		
		// 사용자 이름과 권한 정보를 포함한 Authentication 객체를 생성합니다.
		Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
		
		// SecurityContextHolder에 Authentication 객체를 설정하여 시큐리티 세션에 사용자 정보를 등록합니다.
		SecurityContextHolder.getContext().setAuthentication(auth);
		
		// 다음 필터를 실행합니다.
		filterChain.doFilter(request, response);
	}
}
