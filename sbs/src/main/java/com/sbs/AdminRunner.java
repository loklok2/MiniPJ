package com.sbs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.sbs.auth.domain.Member;
import com.sbs.auth.domain.UserRole;
import com.sbs.auth.repository.MemberRepository;

@Component
public class AdminRunner implements CommandLineRunner {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!memberRepository.existsByUsername("admin@test.com")) {
            Member admin = new Member();
            admin.setUsername("admin@test.com");
            admin.setPassword(passwordEncoder.encode("test"));
            admin.setNickname("Admin");
            admin.setEnabled(true);

            // 새로운 UserRole 생성 및 설정
            UserRole adminRole = new UserRole();
            adminRole.setRoleName("ROLE_ADMIN");
            adminRole.setMember(admin);

            // Member의 roles에 UserRole 추가
            admin.getRoles().add(adminRole);

            memberRepository.save(admin);
        }
    }
}
