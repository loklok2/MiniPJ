package com.sbs.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbs.auth.domain.Member;

import java.util.List;


// Member 엔티티에 대한 데이터베이스 작업을 처리하는 JPA 리포지토리 인터페이스입니다.
public interface MemberRepository extends JpaRepository<Member, Long> {

    // 주어진 사용자 이름(로그인 ID)으로 회원을 검색하는 메서드입니다.
    Optional<Member> findByUsername(String username);
    
    // 주어진 이메일 인증 토큰으로 회원을 검색하는 메서드입니다.
    Optional<Member> findByVerificationToken(String verificationToken);
    
    // 주어진 사용자 이름(로그인 ID)이 이미 존재하는지 확인하는 메서드입니다.
    boolean existsByUsername(String username);
    
    //닉네임으로 일치하는 사용자 찾기(아이디찾기때 사용하는 메소드)
    Optional<Member> findByNickname(String nickname);
    
    //비밀번호 재설정 토큰으로 사용자 찾기
	Optional<Member> findByResetPasswordToken(String token);
}
