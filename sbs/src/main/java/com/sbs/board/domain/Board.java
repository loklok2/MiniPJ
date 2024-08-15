package com.sbs.board.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.sbs.auth.domain.Member;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class Board {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // 게시글의 고유 ID
    
    private String title;  // 게시글의 제목
    private String content;  // 게시글의 내용
    private String authorNickname;  // 게시글 작성 당시의 닉네임
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private Member author;  // Member 엔티티와의 관계

    private LocalDateTime createDate;  // 게시글 생성 시간
    private LocalDateTime updateDate;  // 게시글 수정 시간
    
    private int viewCount = 0; //게시글 조회수
    private int likeCount = 0; //게시글 좋아요 수
    
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images = new ArrayList<>(); //여러이미지 리스트
    
}
