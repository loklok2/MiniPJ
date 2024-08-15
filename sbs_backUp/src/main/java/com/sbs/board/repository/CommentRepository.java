package com.sbs.board.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.sbs.board.domain.Comment;
import com.sbs.board.domain.Board;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByBoard(Board board);
}
