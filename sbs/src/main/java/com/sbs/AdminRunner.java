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
        if (!memberRepository.existsByUsername("admin@test.com")) {
            Member admin = new Member();
            admin.setUsername("admin@test.com");
            admin.setPassword(passwordEncoder.encode("test"));
            admin.setNickname("Admin");
            admin.setRoles(Role.ROLE_ADMIN);
            admin.setEnabled(true);

            memberRepository.save(admin);
        }
    }
}

