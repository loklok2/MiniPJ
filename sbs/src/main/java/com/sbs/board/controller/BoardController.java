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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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

	// 모든 게시글을 조회하는 엔드포인트
	@GetMapping("/public")
	public ResponseEntity<List<BoardDTO>> getAllBoards() {
		List<BoardDTO> boardDTOs = boardService.getAllBoards();
		return new ResponseEntity<>(boardDTOs, HttpStatus.OK);
	}

	// 특정 게시글을 ID로 조회하고 조회수를 증가시키는 엔드포인트
	@GetMapping("/{id}")
	public ResponseEntity<BoardDTO> getBoardById(@PathVariable Long id) {
		BoardDTO boardDTO = boardService.getBoardById(id);
		if (boardDTO != null) {
			return new ResponseEntity<>(boardDTO, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}

	// 게시글을 생성하는 엔드포인트. 인증된 사용자만 접근 가능
	@PostMapping("/create")
	public ResponseEntity<BoardDTO> createBoard(@RequestPart("board") BoardDTO boardDTO,
												@RequestPart(value = "images", required = false) List<MultipartFile> images,
												Authentication authentication) {

		String username = authentication.getName();
		Member member = memberRepository.findByUsername(username).orElse(null);

		if (member != null) {
			BoardDTO createdBoardDTO = boardService.createBoard(boardDTO, member, images);
			return new ResponseEntity<>(createdBoardDTO, HttpStatus.CREATED);
		} else {
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}
	}

	// 게시글을 수정하는 엔드포인트. 작성자만 수정 가능
	@PutMapping("/{id}")
	public ResponseEntity<BoardDTO> updateBoard(@PathVariable Long id, 
												@RequestPart("board") String boardJson,
												@RequestPart(value = "images", required = false) List<MultipartFile> images,
												Authentication authentication) throws JsonProcessingException {
		
		ObjectMapper objectMapper = new ObjectMapper();
		BoardDTO boardDTO = objectMapper.readValue(boardJson, BoardDTO.class);
		
		String currentUsername = authentication.getName();
		BoardDTO updatedBoardDTO = boardService.updateBoard(id, boardDTO, images, currentUsername);
		
		if (updatedBoardDTO != null) {
			return new ResponseEntity<>(updatedBoardDTO, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}

	// 게시글을 삭제하는 엔드포인트. 작성자만 삭제 가능
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteBoard(@PathVariable Long id, Authentication authentication) {
		String currentUsername = authentication.getName();
		if (boardService.deleteBoard(id, currentUsername)) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}

	// 게시글 좋아요 수를 증가시키는 엔드포인트
	@PostMapping("/{id}/like")
	public ResponseEntity<BoardDTO> likeBoard(@PathVariable Long id) {
		BoardDTO likedBoardDTO = boardService.likeBoard(id);
		if (likedBoardDTO != null) {
			return new ResponseEntity<>(likedBoardDTO, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
}
