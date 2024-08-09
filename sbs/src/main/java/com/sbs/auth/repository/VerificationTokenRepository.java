package com.sbs.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbs.auth.domain.VerificationToken;


// Member 엔티티에 대한 데이터베이스 작업을 처리하는 JPA 리포지토리 인터페이스입니다.
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
	Optional<VerificationToken> findByToken(String token);
}
