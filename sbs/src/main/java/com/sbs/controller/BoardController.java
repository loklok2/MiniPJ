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

@RestController  // 이 클래스가 RESTful 웹 서비스의 컨트롤러임을 나타냅니다.
@RequestMapping("/api/boards")  // 이 컨트롤러의 기본 경로를 "/api/boards"로 설정합니다.
public class BoardController {

    @Autowired
<<<<<<< HEAD
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
=======
    private BoardService boardService;  // BoardService를 주입받아 사용합니다.

    @Autowired
    private MemberRepository memberRepository;  // MemberRepository를 주입받아 사용합니다.

    // 전체 게시글 목록을 반환합니다.
    @GetMapping
    public ResponseEntity<List<Board>> getAllBoards() {
        // BoardService를 이용해 모든 게시글을 가져와서 HTTP 200 OK 상태와 함께 응답합니다.
        return new ResponseEntity<>(boardService.getAllBoards(), HttpStatus.OK);
    }
    
    // 특정 ID의 게시글을 반환합니다.
    @GetMapping("/{id}")
    public ResponseEntity<Board> getBoardById(@PathVariable Long id) {
        // 주어진 ID로 게시글을 조회합니다.
        Board board = boardService.getBoardById(id);
        if (board != null) {
            // 게시글이 존재하면 HTTP 200 OK 상태와 함께 게시글을 응답합니다.
            return new ResponseEntity<>(board, HttpStatus.OK);
        }
        // 게시글이 존재하지 않으면 HTTP 404 NOT FOUND 상태를 응답합니다.
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    // 새로운 게시글을 생성합니다.
    @PostMapping
    public ResponseEntity<Board> createBoard(@RequestBody Board board, Authentication authentication) {
        // 인증된 사용자의 이름(이메일)을 가져옵니다.
        String username = authentication.getName();
        // 사용자의 이름으로 사용자 정보를 조회합니다.
        Member member = memberRepository.findByUsername(username).orElse(null);

        if (member != null) {
            // 사용자가 존재하면 게시글 작성자의 닉네임을 설정합니다.
            board.setAuthorNickname(member.getNickname());
            // 게시글을 생성하고, HTTP 201 CREATED 상태와 함께 생성된 게시글을 응답합니다.
            return new ResponseEntity<>(boardService.createBoard(board), HttpStatus.CREATED);
        } else {
            // 인증되지 않은 사용자일 경우 HTTP 401 UNAUTHORIZED 상태를 응답합니다.
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
    
    // 기존 게시글을 수정합니다.
    @PutMapping("/{id}")
    public ResponseEntity<Board> updateBoard(@PathVariable Long id, @RequestBody Board board2) {
        // 주어진 ID로 게시글을 수정합니다.
        Board updatedBoard = boardService.updateBoard(id, board2);
        if (updatedBoard != null) {
            // 수정된 게시글이 존재하면 HTTP 200 OK 상태와 함께 수정된 게시글을 응답합니다.
            return new ResponseEntity<>(updatedBoard, HttpStatus.OK);
        }
        // 수정할 게시글이 존재하지 않으면 HTTP 404 NOT FOUND 상태를 응답합니다.
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    // 특정 ID의 게시글을 삭제합니다.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long id) {
        // 주어진 ID로 게시글을 삭제합니다.
        if (boardService.deleteBoard(id)) {
            // 삭제가 성공하면 HTTP 204 NO CONTENT 상태를 응답합니다.
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        // 삭제할 게시글이 존재하지 않으면 HTTP 404 NOT FOUND 상태를 응답합니다.
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
>>>>>>> 39f029607ac6fbf2f2b70ef3312d7de8be263b46
    }
}
