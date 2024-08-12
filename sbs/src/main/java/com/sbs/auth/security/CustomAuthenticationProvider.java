package com.sbs.auth.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.sbs.auth.domain.Member;
import com.sbs.auth.exception.TemporaryPasswordException;
import com.sbs.auth.repository.MemberRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MemberRepository memberRepository;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();

        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.warn("사용자명: {} 에 대한 인증 실패 - 사용자명을 찾을 수 없음", username);
                    return new BadCredentialsException("잘못된 사용자명 또는 비밀번호입니다.");
                });

        if (passwordEncoder.matches(password, member.getPassword())) {
            if (member.isTemporaryPassword()) {
                log.warn("사용자명: {} 임시 비밀번호 사용", username);
                throw new TemporaryPasswordException("임시 비밀번호가 사용되었습니다. 비밀번호를 재설정해 주세요.");
            }
            UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                    member.getUsername(),
                    member.getPassword(),
                    AuthorityUtils.createAuthorityList(member.getRole().name())
            );
            return new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());
        } else {
            log.warn("사용자명: {} 에 대한 인증 실패 - 잘못된 비밀번호", username);
            throw new BadCredentialsException("잘못된 사용자명 또는 비밀번호입니다.");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
