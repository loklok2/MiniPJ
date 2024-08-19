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
import com.sbs.board.domain.Comment;
import com.sbs.board.domain.CommentDTO;
import com.sbs.board.repository.BoardRepository;
import com.sbs.board.repository.CommentRepository;
import com.sbs.board.service.CommentService;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private MemberRepository memberRepository;
    
    
    //게시글에 대한 모든 댓글 조회
    @GetMapping("/board/{boardId}")
    public ResponseEntity<List<Comment>> getCommentByBoard(@PathVariable Long baordId) {
    	List<Comment> comments = commentService.getCommnetByBoard(baordId);
    	if(comments != null & !comments.isEmpty()) {
    		return new ResponseEntity<>(comments, HttpStatus.OK);    
    	}
    	return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    //특정 댓글 상세조회
    @GetMapping("{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable Long id){
    	Comment comment = commentService.getCommentById(id);
    	if(comment != null) {
    		return new ResponseEntity<>(comment, HttpStatus.OK);
    	}
    	return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    

    // 댓글 작성
    @PostMapping("/create")
    public ResponseEntity<Comment> createComment(@RequestBody CommentDTO commentDTO, Authentication authentication) {
        String username = authentication.getName();

        // 게시글과 부모 댓글 객체를 조회
        Board board = boardRepository.findById(commentDTO.getBoardId()).orElse(null);
        Comment parentComment = commentDTO.getParentCommentId() != null ? 
                                 commentRepository.findById(commentDTO.getParentCommentId()).orElse(null) : null;

        // 작성자 조회
        Member author = memberRepository.findByUsername(username).orElse(null);

        if (board == null || author == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // 댓글 생성
        Comment comment = new Comment();
        comment.setContent(commentDTO.getContent());
        comment.setBoard(board);
        comment.setAuthor(author);
        comment.setAuthorNickname(author.getNickname()); // 작성자의 닉네임 설정
        comment.setParentComment(parentComment);

        Comment createdComment = commentService.createComment(comment);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    // 댓글 수정
    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long id, @RequestBody String newContent, Authentication authentication) {
        String username = authentication.getName();
        Comment updatedComment = commentService.updateComment(id, newContent, username);

        if (updatedComment != null) {
            return new ResponseEntity<>(updatedComment, HttpStatus.OK);
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
    public ResponseEntity<Comment> likeComment(@PathVariable Long id) {
        Comment likedComment = commentService.likeComment(id);
        if (likedComment != null) {
            return new ResponseEntity<>(likedComment, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
