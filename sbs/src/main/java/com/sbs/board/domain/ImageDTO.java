package com.sbs.board.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageDTO {
    private Long id;         // 이미지의 고유 ID
    private String filename; // 이미지 이름
    private String mimeType; // MIME 타입
    private String url;      // 이미지 URL
}
