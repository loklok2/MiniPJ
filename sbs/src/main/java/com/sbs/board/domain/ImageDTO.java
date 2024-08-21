package com.sbs.board.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageDTO {
    private Long id;         // 이미지의 고유 ID
    private String filename; // 이미지 이름
    private String mimeType; // MIME 타입
    private String url;      // 이미지 URL
    
    
    // 엔티티로부터 DTO로 변환하는 메서드
    public static ImageDTO fromEntity(Image image) {
        return ImageDTO.builder()
                .id(image.getId())
                .filename(image.getFilename())
                .mimeType(image.getMimeType())
                .url(image.getUrl())
                .build();
    }
}
