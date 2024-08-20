package com.sbs.auth.security;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.sbs.auth.domain.Member;
import com.sbs.auth.domain.Role;
import com.sbs.auth.repository.MemberRepository;
import com.sbs.util.CustomMyUtil;
import com.sbs.util.JWTUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	private final MemberRepository memberRepo;
	private final PasswordEncoder encoder;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		log.info("OAuth2SuccessHandler: 인증 성공 후 처리");

		OAuth2User user = (OAuth2User) authentication.getPrincipal();
		String username = CustomMyUtil.getUsernameFromOAuth2User(user);

		if (username == null) {
			log.error("onAuthenticationSuccess: OAuth2 사용자로부터 사용자 이름을 생성할 수 없습니다!");
			throw new ServletException("OAuth2 사용자로부터 사용자 이름을 생성할 수 없습니다!");
		}
		log.info("onAuthenticationSuccess: 사용자 이름 " + username);

		Member member = memberRepo.findByUsername(username).orElseGet(() -> {
			Member newMember = Member.builder().username(username).password(encoder.encode("1a2s3d4f")) // 임시 비밀번호 설정
                    .username(username)
                    .password(encoder.encode("1a2s3d4f")) // 임시 비밀번호 설정
                    .enabled(true) // 계정 활성화
                    .nickname(username) // 닉네임을 사용자 이름으로 설정
                    .role(Role.ROLE_MEMBER) // 기본 역할 설정
                    .joinDate(LocalDateTime.now())
                    .build();
			return memberRepo.save(newMember);
		});

		// JWT 토큰 생성
		String jwtToken = JWTUtil.getJWT(username);
		String redirectUrl = "http://localhost:3000/oauth2/redirect?token=" + jwtToken + "&id=" + "&username="
				+ member.getUsername() + "&nickname=" + member.getNickname();
		response.sendRedirect(redirectUrl);
	}
}