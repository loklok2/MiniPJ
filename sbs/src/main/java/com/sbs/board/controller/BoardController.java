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
import com.sbs.board.domain.BoardDTO;
import com.sbs.board.service.BoardService;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @Autowired
    private MemberRepository memberRepository;

    // 모든 게시글 목록 조회
    @GetMapping("/public")
    public ResponseEntity<List<BoardDTO>> getAllBoards() {
        List<BoardDTO> boardDTOs = boardService.getAllBoards();
        return new ResponseEntity<>(boardDTOs, HttpStatus.OK);
    }
    
    // 특정 게시글 조회 및 조회수 증가
    @GetMapping("/{id}")
    public ResponseEntity<BoardDTO> getBoardById(@PathVariable Long id) {
        BoardDTO boardDTO = boardService.getBoardById(id);
        if (boardDTO != null) {
            return new ResponseEntity<>(boardDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    // 게시글 생성
    @PostMapping("/create")
    public ResponseEntity<BoardDTO> createBoard(@RequestBody BoardDTO boardDTO, Authentication authentication) {
        String username = authentication.getName();
        Member member = memberRepository.findByUsername(username).orElse(null);

        if (member != null) {
            BoardDTO createdBoardDTO = boardService.createBoard(boardDTO, member);
            return new ResponseEntity<>(createdBoardDTO, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
    
    // 게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<BoardDTO> updateBoard(@PathVariable Long id, @RequestBody BoardDTO boardDTO) {
        BoardDTO updatedBoardDTO = boardService.updateBoard(id, boardDTO);
        if (updatedBoardDTO != null) {
            return new ResponseEntity<>(updatedBoardDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    // 게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long id) {
        if (boardService.deleteBoard(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // 특정 게시글에 대해 좋아요수 증가
    @PostMapping("/{id}/like")
    public ResponseEntity<BoardDTO> likeBoard(@PathVariable Long id) {
        BoardDTO likedBoardDTO = boardService.likeBoard(id);
        if (likedBoardDTO != null) {
            return new ResponseEntity<>(likedBoardDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
