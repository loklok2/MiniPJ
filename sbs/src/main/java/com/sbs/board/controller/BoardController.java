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
	private BoardService boardService; // BoardService 주입

	@Autowired
	private MemberRepository memberRepository; // MemberRepository 주입

	// 모든 게시글을 조회하는 엔드포인트
	@GetMapping("/public")
	public ResponseEntity<List<BoardDTO>> getAllBoards() {
		List<BoardDTO> boardDTOs = boardService.getAllBoards(); // 모든 게시글 가져오기
		return new ResponseEntity<>(boardDTOs, HttpStatus.OK); // OK 상태 코드와 함께 게시글 리스트 반환
	}

	// 특정 게시글을 ID로 조회하고 조회수를 증가시키는 엔드포인트
	@GetMapping("/{id}")
	public ResponseEntity<BoardDTO> getBoardById(@PathVariable("id") Long id) {
		BoardDTO boardDTO = boardService.getBoardById(id); // ID로 게시글 조회
		if (boardDTO != null) {
			return new ResponseEntity<>(boardDTO, HttpStatus.OK); // 게시글이 존재하면 OK 상태 코드와 함께 반환
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 게시글이 존재하지 않으면 NOT_FOUND 상태 코드 반환
	}

	// 게시글을 생성하는 엔드포인트. 인증된 사용자만 접근 가능
	@PostMapping("/create")
	public ResponseEntity<BoardDTO> createBoard(@RequestPart("board") BoardDTO boardDTO,
												@RequestPart(value = "images", required = false) List<MultipartFile> images,
												Authentication authentication) {

		String username = authentication.getName(); // 인증된 사용자 이름 가져오기
		Member member = memberRepository.findByUsername(username).orElse(null); // 사용자 이름으로 Member 객체 조회

		if (member != null) {
			BoardDTO createdBoardDTO = boardService.createBoard(boardDTO, member, images); // 게시글 생성
			return new ResponseEntity<>(createdBoardDTO, HttpStatus.CREATED); // CREATED 상태 코드와 함께 생성된 게시글 반환
		} else {
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // 인증되지 않은 경우 UNAUTHORIZED 상태 코드 반환
		}
	}

	// 게시글을 수정하는 엔드포인트. 작성자만 수정 가능
	@PutMapping("/{id}")
	public ResponseEntity<BoardDTO> updateBoard(@PathVariable("id") Long id, 
												@RequestPart("board") String boardJson,
												@RequestPart(value = "images", required = false) List<MultipartFile> images,
												Authentication authentication) throws JsonProcessingException {
		
		ObjectMapper objectMapper = new ObjectMapper();
		BoardDTO boardDTO = objectMapper.readValue(boardJson, BoardDTO.class); // JSON을 BoardDTO 객체로 변환
		
		String currentUsername = authentication.getName(); // 현재 사용자 이름 가져오기
		BoardDTO updatedBoardDTO = boardService.updateBoard(id, boardDTO, images, currentUsername); // 게시글 수정
		
		if (updatedBoardDTO != null) {
			return new ResponseEntity<>(updatedBoardDTO, HttpStatus.OK); // 수정된 게시글과 함께 OK 상태 코드 반환
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 게시글이 존재하지 않으면 NOT_FOUND 상태 코드 반환
	}

	// 게시글을 삭제하는 엔드포인트. 작성자만 삭제 가능
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteBoard(@PathVariable("id") Long id, Authentication authentication) {
		String currentUsername = authentication.getName(); // 현재 사용자 이름 가져오기
		if (boardService.deleteBoard(id, currentUsername)) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 삭제 성공 시 NO_CONTENT 상태 코드 반환
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 게시글이 존재하지 않으면 NOT_FOUND 상태 코드 반환
	}

	// 게시글 좋아요 수를 증가시키는 엔드포인트
	@PostMapping("/{id}/like")
	public ResponseEntity<BoardDTO> likeBoard(@PathVariable("id") Long id) {
		BoardDTO likedBoardDTO = boardService.likeBoard(id); // 좋아요 수 증가
		if (likedBoardDTO != null) {
			return new ResponseEntity<>(likedBoardDTO, HttpStatus.OK); // OK 상태 코드와 함께 업데이트된 게시글 반환
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 게시글이 존재하지 않으면 NOT_FOUND 상태 코드 반환
	}
}
