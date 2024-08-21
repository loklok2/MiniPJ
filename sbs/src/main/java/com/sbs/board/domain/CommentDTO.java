package com.sbs.board.domain;

import java.time.LocalDateTime;

import com.sbs.auth.domain.Member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDTO {
    private Long id; // 댓글 ID
    private Long boardId; // 게시글 ID
    private Long authorId; // 작성자 ID
    private String authorNickname; // 작성자 닉네임
    private Long parentCommentId; // 부모 댓글 ID
    private String content; // 댓글 내용
    private LocalDateTime createDate; // 댓글 생성일
    private LocalDateTime editedDate; // 댓글 수정일
    private boolean isEdited; // 댓글 수정 여부
    private boolean isChild; // 자식 댓글 여부
    private int likeCount; // 댓글 좋아요 수

    // 엔티티로부터 DTO로 변환하는 메서드
    public static CommentDTO fromEntity(Comment comment) {
        return CommentDTO.builder()
                .id(comment.getId())
                .boardId(comment.getBoard() != null ? comment.getBoard().getId() : null)
                .authorId(comment.getAuthor() != null ? comment.getAuthor().getId() : null)
                .authorNickname(comment.getAuthor() != null ? comment.getAuthor().getNickname() : null)
                .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
                .content(comment.getContent())
                .createDate(comment.getCreateDate())
                .editedDate(comment.getEditedDate())
                .isEdited(comment.isEdited())
                .isChild(comment.isChild())
                .likeCount(comment.getLikeCount())
                .build();
    }

    // DTO를 엔티티로 변환하는 메서드 추가
    public Comment toEntity(Board board, Member author, Comment parentComment) {
        Comment comment = new Comment();
        comment.setId(this.id);
        comment.setBoard(board); // 게시글 설정
        comment.setAuthor(author); // 작성자 설정
        comment.setAuthorNickname(author.getNickname()); // 작성자 닉네임 설정
        comment.setParentComment(parentComment); // 부모 댓글 설정
        comment.setContent(this.content); // 댓글 내용 설정
        comment.setCreateDate(this.createDate != null ? this.createDate : LocalDateTime.now()); // 생성일 설정
        comment.setEdited(this.isEdited); // 수정 여부 설정
        comment.setEditedDate(this.editedDate); // 수정일 설정
        comment.setChild(this.isChild); // 자식 댓글 여부 설정
        comment.setLikeCount(this.likeCount); // 좋아요 수 설정
        return comment;
    }
}
