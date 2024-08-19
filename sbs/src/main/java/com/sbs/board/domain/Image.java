package com.sbs.board.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // 이미지의 고유 ID

    
    private String filename; //이미지 이름
    private String mimeType; // MIME 타입 (예: image/jpeg, image/png 등)
    
    @Lob
    @Column(name = "data", columnDefinition = "LONGBLOB")
    private byte[] data; //이미지 데이터(BLOB형식)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;  // Board 엔티티와의 관계
    
    // 이미지 URL을 생성하는 메서드
    public String getUrl() {
        return "/api/images/" + this.id;
    }
    
}
