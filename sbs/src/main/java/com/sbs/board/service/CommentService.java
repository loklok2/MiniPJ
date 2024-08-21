package com.sbs.board.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.sbs.auth.domain.Member;
import com.sbs.auth.repository.MemberRepository;
import com.sbs.board.domain.Board;
import com.sbs.board.domain.Comment;
import com.sbs.board.domain.CommentDTO;
import com.sbs.board.repository.BoardRepository;
import com.sbs.board.repository.CommentRepository;

import jakarta.transaction.Transactional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepo; // CommentRepository 주입

    @Autowired
    private BoardRepository boardRepo; // BoardRepository 주입

    @Autowired
    private MemberRepository memberRepository; // MemberRepository 주입

    // 게시글에 대한 전체 댓글 조회
    public List<Comment> getCommentsByBoard(Long boardId) {
        Board board = boardRepo.findById(boardId)
                // 게시글을 찾을 수 없을 때 404 Not Found 상태 코드 반환
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."));

        List<Comment> comments = commentRepo.findByBoard(board); // 게시글에 해당하는 댓글 조회
        return comments.isEmpty() ? new ArrayList<>() : comments; // 댓글이 없으면 빈 리스트 반환
    }

    // 특정 댓글의 상세 조회
    public Comment getCommentById(Long id) {
        return commentRepo.findById(id)
                // 댓글을 찾을 수 없을 때 404 Not Found 상태 코드 반환
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "댓글을 찾을 수 없습니다."));
    }

    // 댓글 작성
    @Transactional
    public Comment createComment(CommentDTO commentDTO) {
        // 게시글과 부모 댓글을 조회
        Board board = boardRepo.findById(commentDTO.getBoardId())
                // 게시글을 찾을 수 없을 때 404 Not Found 상태 코드 반환
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."));

        Comment parentComment = commentDTO.getParentCommentId() != null
                ? commentRepo.findById(commentDTO.getParentCommentId())
                    // 부모 댓글을 찾을 수 없을 때 404 Not Found 상태 코드 반환
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "부모 댓글을 찾을 수 없습니다."))
                : null;

        // 작성자 조회
        Member author = memberRepository.findById(commentDTO.getAuthorId())
                // 작성자를 찾을 수 없을 때 404 Not Found 상태 코드 반환
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "작성자를 찾을 수 없습니다."));

        // CommentDTO를 Comment 엔티티로 변환하여 저장
        Comment comment = commentDTO.toEntity(board, author, parentComment);
        return commentRepo.save(comment);
    }

    // 댓글 수정
    @Transactional
    public Comment updateComment(Long id, String newContent, String username) {
        Comment comment = commentRepo.findById(id)
                // 댓글을 찾을 수 없을 때 404 Not Found 상태 코드 반환
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "댓글을 찾을 수 없습니다."));

        if (!comment.getAuthor().getUsername().equals(username)) {
            // 작성자가 아닌 경우 403 Forbidden 상태 코드 반환
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "댓글을 수정할 권한이 없습니다.");
        }

        comment.setContent(newContent); // 댓글 내용 수정
        comment.setEdited(true); // 수정 여부 설정
        comment.setEditedDate(LocalDateTime.now()); // 수정 시간 설정
        return commentRepo.save(comment); // 수정된 댓글 저장
    }

    // 댓글 삭제
    @Transactional
    public boolean deleteComment(Long id, String username) {
        Comment comment = commentRepo.findById(id)
                // 댓글을 찾을 수 없을 때 404 Not Found 상태 코드 반환
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "댓글을 찾을 수 없습니다."));

        if (!comment.getAuthor().getUsername().equals(username)) {
            // 작성자가 아닌 경우 403 Forbidden 상태 코드 반환
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "댓글을 삭제할 권한이 없습니다.");
        }

        commentRepo.delete(comment); // 댓글 삭제
        return true;
    }

    // 댓글 좋아요 증가
    public Comment likeComment(Long id) {
        Comment comment = commentRepo.findById(id)
                // 댓글을 찾을 수 없을 때 404 Not Found 상태 코드 반환
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "댓글을 찾을 수 없습니다."));

        comment.setLikeCount(comment.getLikeCount() + 1); // 좋아요 수 증가
        return commentRepo.save(comment); // 변경 사항 저장
    }
}
