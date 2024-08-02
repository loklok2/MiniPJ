package edu.pnu.config.filter;

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

import edu.pnu.domain.Member;
import edu.pnu.persistence.MemberRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
//OncePerRequestFilter를 상속받게 되면 하나늬 요청에 대해서 단 한번만 필터를 거치게 됨
// 예를 들어 forwarding 되어 다른 페이지로 이동하게 되더라도 다시 이 필터를 거치지 않음
public class JWTAuthorizatioFilter extends OncePerRequestFilter { //httpservlet필터

	//인가 설정을 위해서 사용자의 Role 정보를 읽어 들이기 위한 객체 설정
	private final MemberRepository memberRepository;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String srcToken = request.getHeader("Authorization");   	//요청 헤더에서 Authorization을 얻어옴
		if(srcToken == null || !srcToken.startsWith("Bearer ")) {	//없거나 "Bearer "로 시작하지 않으면 
			filterChain.doFilter(request, response);				//필터를 그냥 통과
			return;			
		}
		String jwtToken = srcToken.replace("Bearer ", "");			//필터에서 "Bearer " 제거
		
		String username = JWT.require(Algorithm.HMAC256("edu.pnu.jwt")).build().verify(jwtToken).getClaim("username").asString();
		
		
		Optional<Member> opt = memberRepository.findById(username); // 토큰에서 얻은 username으로 DB검색해서 사용자를 검색
		if(!opt.isPresent()) {										// 사용자가 존재하지 않는다면
			filterChain.doFilter(request, response);				// 필터를 그냥 통과
			return;
		}
		
		Member findMember = opt.get();
		
		//DB에서 읽은 사용자 정보를 이용해서 UserDetails 타입의 객체 생성
		User user = new User(findMember.getUsername(), findMember.getPassword(), 
				AuthorityUtils.createAuthorityList(findMember.getRole().toString()));
		
		//Authentication 객체 생성 -> 사용자명과 권한관리를 위한 정보를 입력(암호입력필요없음)
		Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
		
		//시큐리티 세션에 등록
		SecurityContextHolder.getContext().setAuthentication(auth);
		
		filterChain.doFilter(request, response);

	}
	




}
