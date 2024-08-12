package com.sbs.board.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sbs.board.domain.Board;
import com.sbs.board.domain.Comment;
import com.sbs.board.repository.CommentRepository;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepo;

    // 특정 게시글에 달린 모든 댓글 조회
    public List<Comment> getCommentsByBoard(Board board) {
        return commentRepo.findByBoard(board);
    }

    // 댓글 ID로 특정 댓글 조회
    public Optional<Comment> getCommentById(Long id) {
        return commentRepo.findById(id);
    }

    // 새로운 댓글 작성
    public Comment createComment(Comment comment) {
        return commentRepo.save(comment);
    }

    // 댓글 내용 업데이트
    public Comment updateComment(Long id, String newContent) {
        Optional<Comment> optionalComment = commentRepo.findById(id);

        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            comment.setContent(newContent);
            return commentRepo.save(comment);
        }
        return null;
    }

    // 댓글 삭제
    public boolean deleteComment(Long id) {
        if (commentRepo.existsById(id)) {
            commentRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
