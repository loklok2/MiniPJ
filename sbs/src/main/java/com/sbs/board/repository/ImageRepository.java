package com.sbs.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbs.board.domain.Image;
import com.sbs.board.domain.Board;

public interface ImageRepository extends JpaRepository<Image, Long> {
    void deleteByBoard(Board board);
}
