package com.sbs.board.controller;

import java.util.List;
import java.util.Map;

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
import com.sbs.board.domain.Comment;
import com.sbs.board.domain.CommentDTO;
import com.sbs.board.service.CommentService;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

	@Autowired
	private CommentService commentService; 

	@Autowired
	private MemberRepository memberRepository; 
	
	// 게시글에 대한 모든 댓글 조회
	@GetMapping("/public/board/{boardId}")
	public ResponseEntity<List<CommentDTO>> getCommentByBoard(@PathVariable Long boardId) {
        List<Comment> comments = commentService.getCommentsByBoard(boardId); // 게시글 ID로 댓글 조회
        List<CommentDTO> commentDTOs = comments.stream()
        									   .map(CommentDTO::fromEntity)
        									   .toList(); // 댓글 엔티티를 DTO로 변환
        return new ResponseEntity<>(commentDTOs, HttpStatus.OK);	// OK 상태 코드와 함께 댓글 리스트 반환
    }

	// 댓글 작성
	@PostMapping("/create")
	public ResponseEntity<CommentDTO> createComment(@RequestBody CommentDTO commentDTO, Authentication authentication) {
		String username = authentication.getName(); // 인증된 사용자 이름 가져오기

		// 작성자 조회
		Member author = memberRepository.findByUsername(username).orElse(null); // 사용자 이름으로 작성자 조회
		if (author == null || commentDTO.getBoardId() == null) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 작성자 또는 게시글 ID가 없으면 BAD_REQUEST 반환
		}

		// 댓글 생성
		commentDTO.setAuthorId(author.getId()); // 작성자의 ID를 DTO에 설정
		Comment comment = commentService.createComment(commentDTO); // 댓글 생성 서비스 호출
		if (comment != null) {
			return new ResponseEntity<>(CommentDTO.fromEntity(comment), HttpStatus.CREATED); // CREATED 상태 코드와 함께 생성된 댓글 반환
		}
		return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 댓글 생성 실패 시 BAD_REQUEST 반환
	}

	// 댓글 수정
	@PutMapping("/{id}")
	public ResponseEntity<CommentDTO> updateComment(@PathVariable("id") Long id, @RequestBody Map<String, String> requestBody, Authentication authentication) {
		String username = authentication.getName(); // 인증된 사용자 이름 가져오기
		String newContent = requestBody.get("content"); // 요청 본문에서 새로운 댓글 내용 가져오기

		Comment updatedComment = commentService.updateComment(id, newContent, username); // 댓글 수정 서비스 호출

		if (updatedComment != null) {
			System.out.println("Updated Comment isEdited: " + updatedComment.isEdited()); // 수정 여부 로그 출력
			System.out.println("Updated Comment editedDate: " + updatedComment.getEditedDate()); // 수정 날짜 로그 출력
			return new ResponseEntity<>(CommentDTO.fromEntity(updatedComment), HttpStatus.OK); // OK 상태 코드와 함께 수정된 댓글 반환
		}

		return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 댓글이 존재하지 않으면 NOT_FOUND 상태 코드 반환
	}

	// 댓글 삭제
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteComment(@PathVariable("id") Long id, Authentication authentication) {
		String username = authentication.getName(); // 인증된 사용자 이름 가져오기
		if (commentService.deleteComment(id, username)) { // 댓글 삭제 서비스 호출
			return new ResponseEntity<>(HttpStatus.NO_CONTENT); // NO_CONTENT 상태 코드 반환
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 댓글이 존재하지 않으면 NOT_FOUND 상태 코드 반환
	}

	// 댓글 좋아요 증가
	@PostMapping("/{id}/like")
	public ResponseEntity<CommentDTO> likeComment(@PathVariable Long id) {
		Comment likedComment = commentService.likeComment(id); // 댓글 좋아요 서비스 호출
		if (likedComment != null) {
			return new ResponseEntity<>(CommentDTO.fromEntity(likedComment), HttpStatus.OK); // OK 상태 코드와 함께 업데이트된 댓글 반환
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 댓글이 존재하지 않으면 NOT_FOUND 상태 코드 반환
	}
}
