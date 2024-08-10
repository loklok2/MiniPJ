package com.sbs.auth.security;

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
import com.sbs.auth.domain.Member;
import com.sbs.auth.repository.MemberRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JWTAuthorizationFilter extends OncePerRequestFilter {

	private final MemberRepository memberRepository;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String srcToken = request.getHeader("Authorization"); 
		if(srcToken == null || !srcToken.startsWith("Bearer ")) { 
			filterChain.doFilter(request, response); 
			return;			
		}

		String jwtToken = srcToken.replace("Bearer ", ""); 
		
		String username = JWT.require(Algorithm.HMAC256("edu.pnu.jwtkey"))  // 이 키는 실제 환경에서는 안전하게 관리되어야 합니다.
		                    .build()
		                    .verify(jwtToken)
		                    .getClaim("username")
		                    .asString();
		
		Optional<Member> opt = memberRepository.findByUsername(username); 
		if(!opt.isPresent()) { 
			filterChain.doFilter(request, response); 
			return;
		}
		
		Member findMember = opt.get();
		
		// 권한을 단일 Role로 설정
		User user = new User(findMember.getUsername(), findMember.getPassword(), 
				AuthorityUtils.createAuthorityList(findMember.getRole().name()));
		
		Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
		
		SecurityContextHolder.getContext().setAuthentication(auth);
		
		filterChain.doFilter(request, response);
	}
}
