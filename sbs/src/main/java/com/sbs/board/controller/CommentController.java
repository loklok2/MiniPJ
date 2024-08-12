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
import com.sbs.board.domain.CreateCommentRequest;
import com.sbs.board.repository.BoardRepository;
import com.sbs.board.service.CommentService;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private BoardRepository boardRepository;

    // 댓글 작성
    @PostMapping("/create")
    public ResponseEntity<Comment> createComment(@RequestBody CreateCommentRequest request, Authentication authentication) {
        String username = authentication.getName();
        Member member = memberRepository.findByUsername(username).orElse(null);
        Board board = boardRepository.findById(request.getBoardId()).orElse(null);

        if (member == null || board == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Comment comment = new Comment();
        comment.setAuthor(member);
        comment.setBoard(board);
        comment.setContent(request.getContent());

        Comment createdComment = commentService.createComment(comment);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    // 특정 게시글에 달린 모든 댓글 조회
    @GetMapping("/by-board/{boardId}")
    public ResponseEntity<List<Comment>> getCommentsByBoard(@PathVariable Long boardId) {
        Board board = boardRepository.findById(boardId).orElse(null);

        if (board == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<Comment> comments = commentService.getCommentsByBoard(board);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    // 댓글 ID로 특정 댓글 조회
    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable Long id) {
        return commentService.getCommentById(id)
                .map(comment -> new ResponseEntity<>(comment, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 댓글 내용 업데이트
    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long id, @RequestBody String newContent) {
        Comment updatedComment = commentService.updateComment(id, newContent);

        if (updatedComment != null) {
            return new ResponseEntity<>(updatedComment, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // 댓글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        if (commentService.deleteComment(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
