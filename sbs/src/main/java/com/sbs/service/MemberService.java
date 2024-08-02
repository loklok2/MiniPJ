package com.sbs.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sbs.domain.Member;
import com.sbs.domain.Role;
import com.sbs.domain.SignupRequest;
import com.sbs.persistence.MemberRepository;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Member registerUser(SignupRequest signupRequest) {
        if (memberRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        Member member = new Member();
        member.setUsername(signupRequest.getUsername());
        member.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        member.setRoles(Role.ROLE_MEMBER);

        return memberRepository.save(member);
    }
}
