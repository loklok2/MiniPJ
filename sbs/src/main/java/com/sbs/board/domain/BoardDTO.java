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
    
}
