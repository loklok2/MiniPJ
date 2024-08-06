package com.sbs.persistence;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbs.domain.Member;

// Member 엔티티에 대한 데이터베이스 작업을 처리하는 JPA 리포지토리 인터페이스입니다.
public interface MemberRepository extends JpaRepository<Member, Long> {

    // 주어진 사용자 이름(로그인 ID)으로 회원을 검색하는 메서드입니다.
    Optional<Member> findByUsername(String username);
    
    // 주어진 이메일 인증 토큰으로 회원을 검색하는 메서드입니다.
    Optional<Member> findByVerificationToken(String verificationToken);
    
    // 주어진 사용자 이름(로그인 ID)이 이미 존재하는지 확인하는 메서드입니다.
    boolean existsByUsername(String username);
}
