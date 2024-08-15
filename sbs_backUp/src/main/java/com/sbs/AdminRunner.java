package com.sbs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.sbs.auth.domain.Member;
import com.sbs.auth.domain.Role;
import com.sbs.auth.repository.MemberRepository;

@Component
public class AdminRunner implements CommandLineRunner {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 애플리케이션 실행 시 admin 계정이 없으면 생성합니다.
        if (!memberRepository.existsByUsername("admin@test.com")) {
            Member admin = new Member();
            admin.setUsername("admin@test.com");
            admin.setPassword(passwordEncoder.encode("test"));
            admin.setNickname("Admin");
            admin.setEnabled(true);
            admin.setRole(Role.ROLE_ADMIN);  // 관리자로 역할 설정

            memberRepository.save(admin);
        }
    }
}
