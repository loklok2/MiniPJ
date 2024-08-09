package com.sbs.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbs.auth.domain.UserRole;


// Member 엔티티에 대한 데이터베이스 작업을 처리하는 JPA 리포지토리 인터페이스입니다.
public interface RoleRepository extends JpaRepository<UserRole, Long> {

}
