package com.sbs.auth.service;

import com.sbs.auth.domain.Member;
import com.sbs.auth.domain.UserRole;
import com.sbs.auth.repository.MemberRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MemberDetailService implements UserDetailsService {

    @Autowired
    private MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Not Found"));

        if (!member.isEnabled()) {
            throw new DisabledException("Email is not verified");
        }

        // 8/9 수정: Set<UserRole>에서 역할 이름을 추출하여 권한 리스트로 변환
        Set<String> roles = member.getRoles().stream()
                .map(UserRole::getRoleName)
                .collect(Collectors.toSet());

        return new User(
                member.getUsername(),
                member.getPassword(),
                AuthorityUtils.createAuthorityList(roles.toArray(new String[0]))
        );
    }
}
