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

    // 전체 게시글 목록을 조회하는 메서드
    public List<Board> getAllBoards() {
        return boardRepo.findAll();
    }

    // ID로 특정 게시글을 조회하는 메서드
    public Board getBoardById(Long id) {
        return boardRepo.findById(id).orElse(null);
    }

    // 새로운 게시글을 작성하는 메서드
    public Board createBoard(Board board, Member member) {
        board.setAuthor(member);  // 작성자 설정
        board.setAuthorNickname(member.getNickname());  // 닉네임 설정
        board.setCreateDate(LocalDateTime.now());
        return boardRepo.save(board);
    }

    // 기존 게시글을 수정하는 메서드
    public Board updateBoard(Long id, Board board2) {
        Board board = boardRepo.findById(id).orElse(null);
        if (board != null) {
            board.setTitle(board2.getTitle());
            board.setContent(board2.getContent());
            board.setUpdateDate(LocalDateTime.now());
            return boardRepo.save(board);
        }
        return null;
    }

    // 특정 ID의 게시글을 삭제하는 메서드
    public boolean deleteBoard(Long id) {
        if (boardRepo.existsById(id)) {
            boardRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
