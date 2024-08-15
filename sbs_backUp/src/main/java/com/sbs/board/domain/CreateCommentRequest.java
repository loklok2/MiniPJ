package com.sbs.board.domain;

import lombok.Data;

@Data
public class CreateCommentRequest {
	private Long boardId;
	private String content;

}
