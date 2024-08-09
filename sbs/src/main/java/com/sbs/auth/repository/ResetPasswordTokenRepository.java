package com.sbs.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbs.auth.domain.Member;
import com.sbs.auth.domain.ResetPasswordToken;

import java.util.List;


// Member 엔티티에 대한 데이터베이스 작업을 처리하는 JPA 리포지토리 인터페이스입니다.
public interface ResetPasswordTokenRepository extends JpaRepository<ResetPasswordToken, Long> {
	Optional<ResetPasswordToken> findByToken(String token);
}
