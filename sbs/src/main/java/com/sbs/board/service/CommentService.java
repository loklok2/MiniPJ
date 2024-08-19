package com.sbs.board.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sbs.board.domain.Board;
import com.sbs.board.domain.Comment;
import com.sbs.board.repository.BoardRepository;
import com.sbs.board.repository.CommentRepository;

import jakarta.transaction.Transactional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepo;
    
    @Autowired
    private BoardRepository boardRepo;
    
    
    //게시글에 대한 전체 댓글 조회
    public List<Comment> getCommnetByBoard(Long boardId) {
    	Board board = boardRepo.findById(boardId).orElse(null);
    	if(board != null) {
    		return commentRepo.findByBoard(board);
    	}
    	return null;
    }
    
    // 특정 댓글의 상세 조회
    public Comment getCommentById(Long id) {
    	return commentRepo.findById(id).orElse(null);
    }
    
    
    
    // 댓글 작성
    @Transactional
    public Comment createComment(Comment comment) {
        // 자식 댓글 여부 설정
        if (comment.getParentComment() != null) {
            comment.setChild(true);
        }
        return commentRepo.save(comment);
    }
    
    // 댓글 수정
    @Transactional
    public Comment updateComment(Long id, String newContent, String username) {
        Optional<Comment> optionalComment = commentRepo.findById(id);
        
        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            if (comment.getAuthor().getUsername().equals(username)) {
                comment.setContent(newContent);
                comment.setEdited(true); // 수정 여부 설정
                comment.setEditedDate(LocalDateTime.now()); // 수정 시간 설정
                return commentRepo.save(comment);
            }
        }
        return null;
    }
    
    // 댓글 삭제
    @Transactional
    public boolean deleteComment(Long id, String username) {
        Optional<Comment> optionalComment = commentRepo.findById(id);
        
        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            if (comment.getAuthor().getUsername().equals(username)) {
                commentRepo.delete(comment);
                return true;
            }
        }
        return false;
    }
    
    // 댓글 좋아요 증가
    public Comment likeComment(Long id) {
        Optional<Comment> optionalComment = commentRepo.findById(id);
        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            comment.setLikeCount(comment.getLikeCount() + 1);
            return commentRepo.save(comment);
        }
        return null;
    }
}
