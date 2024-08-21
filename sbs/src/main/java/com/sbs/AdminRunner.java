package com.sbs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.sbs.auth.domain.Member;
import com.sbs.auth.domain.Role;
import com.sbs.auth.repository.MemberRepository;

@Component  // 이 클래스를 Spring Bean으로 등록
public class AdminRunner implements CommandLineRunner {

    @Autowired
    private MemberRepository memberRepository;  // MemberRepository 주입

    @Autowired
    private PasswordEncoder passwordEncoder;  // PasswordEncoder 주입

    @Override
    public void run(String... args) throws Exception {
        // 애플리케이션이 시작될 때 실행
        // 'admin@test.com' 사용자 계정이 존재하지 않는 경우에만 아래 로직 실행
        if (!memberRepository.existsByUsername("admin@test.com")) {
            // 새로운 Member 객체 생성
            Member admin = new Member();
            admin.setUsername("admin@test.com");  // 사용자 이름 설정
            admin.setPassword(passwordEncoder.encode("test"));  // 비밀번호 암호화 후 설정
            admin.setNickname("Admin");  // 닉네임 설정
            admin.setEnabled(true);  // 계정 활성화 설정
            admin.setRole(Role.ROLE_ADMIN);  // 관리자 역할 설정

            // 관리자 계정 저장
            memberRepository.save(admin);
        }
    }
}
