package com.sbs.board.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbs.auth.domain.Member;
import com.sbs.board.domain.Board;


public interface BoardRepository extends JpaRepository<Board, Long> {
	//특정 사용자가 작성한 게시글 목록 조회(마이페이지 내가쓴 게시글)
	List<Board> findByAuthor(Member author);
}
