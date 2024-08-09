package com.sbs.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbs.board.domain.Board;

// Board 엔티티에 대한 데이터베이스 작업을 처리하는 JPA 리포지토리 인터페이스입니다.
public interface BoardRepository extends JpaRepository<Board, Long> {
    // JpaRepository 인터페이스를 상속받아 기본적인 CRUD 및 페이징, 정렬 기능을 사용할 수 있습니다.
    // Board 엔티티를 관리하고, 기본 키로 Long 타입의 id를 사용합니다.
}
