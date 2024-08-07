package com.sbs.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.sbs.domain.Member;
import com.sbs.persistence.MemberRepository;

@Service  // 이 클래스가 Spring의 서비스 컴포넌트임을 나타냅니다.
public class MemberDetailService implements UserDetailsService {

    @Autowired
<<<<<<< HEAD
    private MemberRepository memRepo; // MemberRepository를 주입받아 사용

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 사용자가 입력한 username (이메일)으로 DB에서 Member 객체를 찾음
        Member member = memRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Not Found"));

        // 이메일 인증이 완료되었는지 확인
        if (!member.isEnabled()) {
            // 이메일 인증이 완료되지 않았을 경우 예외를 던져 로그인 불가 처리
            throw new RuntimeException("Email is not verified");
        }

        // 디버깅 목적으로 콘솔에 member 정보 출력
        System.out.println(member);

        // Member 객체의 정보를 UserDetails 객체로 변환하여 반환
        // UserDetails 객체는 Spring Security에서 인증된 사용자 정보를 관리하는 데 사용됨
=======
    private MemberRepository memRepo; // MemberRepository를 주입받아 사용합니다.

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 사용자가 입력한 username으로 DB에서 Member 객체를 찾습니다.
        Member member = memRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Not Found"));

        // 이메일 인증이 완료되었는지 확인합니다.
        if (!member.isEnabled()) {
            // 이메일 인증이 완료되지 않았을 경우 예외를 던져 로그인 불가 처리합니다.
            throw new RuntimeException("Email is not verified");
        }

        // 디버깅 목적으로 콘솔에 member 정보 출력 (실제 운영 환경에서는 제거하는 것이 좋습니다).
        System.out.println(member);

        // Member 객체의 정보를 UserDetails 객체로 변환하여 반환합니다.
        // UserDetails 객체는 Spring Security에서 인증된 사용자 정보를 관리하는 데 사용됩니다.
>>>>>>> 39f029607ac6fbf2f2b70ef3312d7de8be263b46
        return new User(
                member.getUsername(), 
                member.getPassword(),
                AuthorityUtils.createAuthorityList(member.getRoles().toString()) // 사용자의 권한 정보 설정
        );
    }
}
