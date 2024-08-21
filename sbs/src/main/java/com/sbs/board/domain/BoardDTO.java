package com.sbs.board.domain;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardDTO {
	private Long id;
	private String title;
	private String content;
	private String authorNickname;
	private Long authorId; // 작성자의 ID
	private LocalDateTime createDate;
	private LocalDateTime updateDate;
	private int viewCount;
	private int likeCount;

	private List<ImageDTO> images; // 이미지 데이터를 저장할 리스트



	// 엔티티로부터 DTO로 변환하는 메서드
	public static BoardDTO fromEntity(Board board) {
		return BoardDTO.builder()
				.id(board.getId())
				.title(board.getTitle())
				.content(board.getContent())
				.authorNickname(board.getAuthorNickname())
				.authorId(board.getAuthor().getId())
				.createDate(board.getCreateDate())
				.updateDate(board.getUpdateDate())
				.viewCount(board.getViewCount())
				.likeCount(board.getLikeCount())
				.images(board.getImages().stream().map(ImageDTO::fromEntity).collect(Collectors.toList()))
				.build();
	}

}
