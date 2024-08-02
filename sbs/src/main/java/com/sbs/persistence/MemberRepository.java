package com.sbs.persistence;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbs.domain.Member;

public interface MemberRepository extends JpaRepository<Member, Long>{

	Optional<Member> findById(String username);

}
