package com.sbs.board.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbs.auth.domain.Member;
import com.sbs.board.domain.Board;
import com.sbs.board.domain.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByBoard(Board board);
    
    //특정 사용자가 작성한 댓글 목록(마이페이지 내 댓글)
    List<Comment> findByAuthor(Member author);
}
