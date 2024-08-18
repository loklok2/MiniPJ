package com.sbs.board.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbs.board.domain.Board;
import com.sbs.board.domain.Image;

public interface ImageRepository extends JpaRepository<Image, Long> {
    void deleteByBoard(Board board);
    List<Image> findByBoardId(Long boardId);
}
