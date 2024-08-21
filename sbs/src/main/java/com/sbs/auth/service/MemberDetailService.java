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
    private MemberRepository memberRepository; // MemberRepository 주입

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 사용자의 인증 정보를 로드
        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다")); // 사용자 이름으로 회원 찾기

        // 계정이 활성화되지 않은 경우 예외 발생
        if (!member.isEnabled()) {
            throw new DisabledException("이메일 인증이 완료되지 않았습니다.");
        }

        // UserDetails 객체 생성 및 반환
        return new User(
                member.getUsername(), // 사용자 이름 설정
                member.getPassword(), // 암호화된 비밀번호 설정
                AuthorityUtils.createAuthorityList(member.getRole().name()) // 사용자 권한 설정
        );
    }
}
