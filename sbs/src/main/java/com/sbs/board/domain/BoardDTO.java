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
	private Long id; // 게시글 ID
	private String title; // 게시글 제목
	private String content; // 게시글 내용
	private String authorNickname; // 작성자 닉네임
	private Long authorId; // 작성자 ID
	private LocalDateTime createDate; // 게시글 생성일
	private LocalDateTime updateDate; // 게시글 수정일
	private int viewCount; // 게시글 조회수
	private int likeCount; // 게시글 좋아요 수

	private List<ImageDTO> images; // 이미지 데이터를 저장할 리스트

	// 엔티티로부터 DTO로 변환하는 메서드
	public static BoardDTO fromEntity(Board board) {
		// Board 엔티티를 BoardDTO로 변환
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
				.images(board.getImages().stream().map(ImageDTO::fromEntity).collect(Collectors.toList())) // 이미지 리스트 변환
				.build();
	}

}
