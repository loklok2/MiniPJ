package com.sbs.board.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sbs.auth.domain.Member;
import com.sbs.board.domain.Board;
import com.sbs.board.repository.BoardRepository;

@Service
public class BoardService {

    @Autowired
    private BoardRepository boardRepo;

    public List<Board> getAllBoards() {
        // 전체 게시글 목록을 조회합니다.
        return boardRepo.findAll();
    }

    public Board getBoardById(Long id) {
        // ID로 특정 게시글을 조회합니다.
        return boardRepo.findById(id).orElse(null);
    }

    public Board createBoard(Board board, Member member) {
        // 새로운 게시글을 작성합니다.
        board.setAuthor(member);  // 작성자 설정
        board.setAuthorNickname(member.getNickname());  // 닉네임 설정
        board.setCreateDate(LocalDateTime.now());
        return boardRepo.save(board);
    }

    public Board updateBoard(Long id, Board board2) {
        // 기존 게시글을 수정합니다.
        Board board = getBoardById(id);
        if (board != null) {
            board.setTitle(board2.getTitle());
            board.setContent(board2.getContent());
            board.setUpdateDate(LocalDateTime.now());
            return boardRepo.save(board);
        }
        return null;
    }

    public boolean deleteBoard(Long id) {
        // 특정 ID의 게시글을 삭제합니다.
        if (boardRepo.existsById(id)) {
            boardRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
