package com.sbs.board.domain;

import java.time.LocalDateTime;

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

}
