package com.sbs.auth.service;

import com.sbs.auth.domain.Member;
import com.sbs.auth.repository.MemberRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.stereotype.Service;

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

        return new User(
                member.getUsername(),
                member.getPassword(),
                AuthorityUtils.createAuthorityList(member.getRoles().name())
        );
    }
}
