package com.sbs.controller;

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

import com.sbs.domain.Board;
import com.sbs.domain.Member;
import com.sbs.service.BoardService;
import com.sbs.persistence.MemberRepository;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

    @Autowired
    private BoardService boardService;  // BoardService를 주입받아 사용

    @Autowired
    private MemberRepository memberRepository;  // MemberRepository를 주입받아 사용

    // 전체 게시글 목록을 반환
    @GetMapping
    public ResponseEntity<List<Board>> getAllBoards() {
        return new ResponseEntity<>(boardService.getAllBoards(), HttpStatus.OK);
    }
    
    // 특정 ID의 게시글을 반환
    @GetMapping("/{id}")
    public ResponseEntity<Board> getBoardById(@PathVariable Long id) {
        Board board = boardService.getBoardById(id);
        if (board != null) {
            return new ResponseEntity<>(board, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // 해당 ID의 게시글이 없으면 404 NOT FOUND 응답
    }
    
    // 새로운 게시글을 생성
    @PostMapping
    public ResponseEntity<Board> createBoard(@RequestBody Board board, Authentication authentication) {
        // 인증된 사용자의 이름(이메일)을 가져옴
        String username = authentication.getName();
        Member member = memberRepository.findByUsername(username).orElse(null);

        if (member != null) {
            board.setAuthorNickname(member.getNickname());  // 게시글 작성자의 닉네임 설정
            return new ResponseEntity<>(boardService.createBoard(board), HttpStatus.CREATED);  // 게시글 생성 후 201 CREATED 응답
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);  // 인증되지 않은 사용자일 경우 401 UNAUTHORIZED 응답
        }
    }
    
    // 기존 게시글을 수정
    @PutMapping("/{id}")
    public ResponseEntity<Board> updateBoard(@PathVariable Long id, @RequestBody Board board2) {
        Board updatedBoard = boardService.updateBoard(id, board2);
        if (updatedBoard != null) {
            return new ResponseEntity<>(updatedBoard, HttpStatus.OK);  // 게시글 수정 성공 시 200 OK 응답
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // 해당 ID의 게시글이 없으면 404 NOT FOUND 응답
    }
    
    // 특정 ID의 게시글을 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long id) {
        if (boardService.deleteBoard(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);  // 삭제 성공 시 204 NO CONTENT 응답
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // 해당 ID의 게시글이 없으면 404 NOT FOUND 응답
    }
}
