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
	private Long id;
	private Long boardId;
	private Long authorId;
	private String authorNickname;
	private Long parentCommentId;
	private String content;
	private LocalDateTime createDate;
	private LocalDateTime editedDate;
	private boolean isEdited;
	private boolean isChild;
	private int likeCount;

	// 엔티티로부터 DTO로 변환하는 메서드
	public static CommentDTO fromEntity(Comment comment) {
		return CommentDTO.builder().id(comment.getId())
				.boardId(comment.getBoard() != null ? comment.getBoard().getId() : null)
				.authorId(comment.getAuthor() != null ? comment.getAuthor().getId() : null)
				.authorNickname(comment.getAuthor() != null ? comment.getAuthor().getNickname() : null)
				.content(comment.getContent()).createDate(comment.getCreateDate()).editedDate(comment.getEditedDate())
				.isEdited(comment.isEdited()).likeCount(comment.getLikeCount()).build();
	}

	// DTO를 엔티티로 변환하는 메서드 추가
	public Comment toEntity(Board board, Member author, Comment parentComment) {
		Comment comment = new Comment();
		comment.setId(this.id);
		comment.setBoard(board);
		comment.setAuthor(author);
		comment.setAuthorNickname(author.getNickname());

		comment.setContent(this.content);
		comment.setCreateDate(this.createDate != null ? this.createDate : LocalDateTime.now());
		comment.setEdited(this.isEdited);
		comment.setEditedDate(this.editedDate);

		comment.setLikeCount(this.likeCount);
		return comment;
	}
	
}
