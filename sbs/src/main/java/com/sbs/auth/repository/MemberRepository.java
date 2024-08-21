package com.sbs.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbs.auth.domain.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

    // 사용자 이름으로 회원을 찾기
    Optional<Member> findByUsername(String username);
    
    // 사용자 이름이 존재하는지 확인
    boolean existsByUsername(String username);
    
    // 닉네임으로 회원을 찾기
    Optional<Member> findByNickname(String nickname);
}
