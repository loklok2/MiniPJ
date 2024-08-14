package com.sbs.board.domain;

import com.sbs.board.repository.BoardRepository;
import com.sbs.board.repository.CommentRepository;
import lombok.Data;

@Data
public class CreateCommentRequest {
    private Long boardId;  // 게시글 ID
    private String content;  // 댓글 내용
    private Long parentCommentId;  // 부모 댓글 ID (대댓글일 경우)

    // BoardRepository를 통해 Board 객체를 조회
    public Board getBoard(BoardRepository boardRepository) {
        return boardRepository.findById(this.boardId).orElse(null);
    }

    // CommentRepository를 통해 ParentComment 객체를 조회
    public Comment getParentComment(CommentRepository commentRepository) {
        if (this.parentCommentId != null) {
            return commentRepository.findById(this.parentCommentId).orElse(null);
        }
        return null;
    }
}
