package com.sbs.board.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbs.board.domain.Board;
import com.sbs.board.domain.Image;

public interface ImageRepository extends JpaRepository<Image, Long> {
    
    // 게시글에 속한 이미지를 삭제
    void deleteByBoard(Board board);
    
    // 게시글 ID로 이미지를 조회
    List<Image> findByBoardId(Long boardId);
}
