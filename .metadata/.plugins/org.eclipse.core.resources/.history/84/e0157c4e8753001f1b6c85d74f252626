package com.sbs.persistence;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbs.domain.Member;

public interface MemberRepository extends JpaRepository<Member, Long>{

	Optional<Member> findByUsername(String username);
	
	// 추가 메서드: 이메일 인증 토큰으로 사용자를 찾음
    Optional<Member> findByVerificationToken(String verificationToken);
	
	boolean existsByUsername(String username);

}
