package com.sbs.auth.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.sbs.auth.domain.Member;
import com.sbs.auth.domain.UserRole;
import com.sbs.auth.exception.TemporaryPasswordException;
import com.sbs.auth.repository.MemberRepository;

import java.util.Set;
import java.util.stream.Collectors;

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
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        // 8/9 수정: Set<UserRole>에서 역할 이름을 추출하여 권한 리스트로 변환
        Set<String> roles = member.getRoles().stream()
                .map(UserRole::getRoleName)
                .collect(Collectors.toSet());

        UserDetails userDetails = new User(
                member.getUsername(),
                member.getPassword(),
                AuthorityUtils.createAuthorityList(roles.toArray(new String[0]))
        );

        if (passwordEncoder.matches(password, userDetails.getPassword())) {
            if (member.isTemporaryPassword()) {
                throw new TemporaryPasswordException("Temporary password used. Redirect to reset password page.");
            }
            return new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());
        } else {
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
