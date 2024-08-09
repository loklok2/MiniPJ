package com.sbs.board.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.auth.domain.Member;
import com.sbs.auth.repository.MemberRepository;
import com.sbs.board.domain.Board;
import com.sbs.board.service.BoardService;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @Autowired
    private MemberRepository memberRepository;

    // 전체 게시글 목록을 반환합니다.
    @GetMapping
    public ResponseEntity<List<Board>> getAllBoards() {
        return new ResponseEntity<>(boardService.getAllBoards(), HttpStatus.OK);
    }

    // 특정 ID의 게시글을 반환합니다.
    @GetMapping("/{id}")
    public ResponseEntity<Board> getBoardById(@PathVariable Long id) {
        Board board = boardService.getBoardById(id);
        if (board != null) {
            return new ResponseEntity<>(board, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // 새로운 게시글을 생성합니다.
    @PostMapping
    public ResponseEntity<Board> createBoard(@RequestBody Board board, Authentication authentication) {
        String username = authentication.getName();
        Member member = memberRepository.findByUsername(username).orElse(null);

        if (member != null) {
            Board createdBoard = boardService.createBoard(board, member);
            return new ResponseEntity<>(createdBoard, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    // 기존 게시글을 수정합니다.
    @PutMapping("/{id}")
    public ResponseEntity<Board> updateBoard(@PathVariable Long id, @RequestBody Board board2) {
        Board updatedBoard = boardService.updateBoard(id, board2);
        if (updatedBoard != null) {
            return new ResponseEntity<>(updatedBoard, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // 특정 ID의 게시글을 삭제합니다.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long id) {
        if (boardService.deleteBoard(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
