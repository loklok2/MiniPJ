package com.sbs.board.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
        List<Comment> comments = commentService.getCommnetByBoard(boardId);
        if (comments != null && !comments.isEmpty()) {
            List<CommentDTO> commentDTOs = comments.stream()
                    .map(CommentDTO::fromEntity)
                    .toList();
            return new ResponseEntity<>(commentDTOs, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    // 특정 댓글 상세 조회
    @GetMapping("/public/{id}")
    public ResponseEntity<CommentDTO> getCommentById(@PathVariable Long id) {
        Comment comment = commentService.getCommentById(id);
        if (comment != null) {
            return new ResponseEntity<>(CommentDTO.fromEntity(comment), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    // 댓글 작성
    @PostMapping("/create")
    public ResponseEntity<CommentDTO> createComment(@RequestBody CommentDTO commentDTO, Authentication authentication) {
        String username = authentication.getName();

        // 작성자 조회
        Member author = memberRepository.findByUsername(username).orElse(null);
        if (author == null || commentDTO.getBoardId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // 댓글 생성
        commentDTO.setAuthorId(author.getId()); // 작성자의 ID를 DTO에 설정
        Comment comment = commentService.createComment(commentDTO);
        if (comment != null) {
            return new ResponseEntity<>(CommentDTO.fromEntity(comment), HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }


    // 댓글 수정
    @PutMapping("/{id}")
    public ResponseEntity<CommentDTO> updateComment(@PathVariable Long id, @RequestBody String newContent, Authentication authentication) {
        String username = authentication.getName();
        Comment updatedComment = commentService.updateComment(id, newContent, username);

        if (updatedComment != null) {
            return new ResponseEntity<>(CommentDTO.fromEntity(updatedComment), HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // 댓글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        if (commentService.deleteComment(id, username)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // 댓글 좋아요 증가
    @PostMapping("/{id}/like")
    public ResponseEntity<CommentDTO> likeComment(@PathVariable Long id) {
        Comment likedComment = commentService.likeComment(id);
        if (likedComment != null) {
            return new ResponseEntity<>(CommentDTO.fromEntity(likedComment), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
