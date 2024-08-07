package com.sbs.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity  // 이 클래스가 JPA 엔티티임을 나타냅니다. 데이터베이스 테이블과 매핑됩니다.
@Getter @Setter @ToString  // Lombok 애너테이션을 사용하여 getter, setter, toString 메서드를 자동으로 생성합니다.
public class Board {
    
    @Id  // 이 필드가 엔티티의 기본 키임을 나타냅니다.
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // 기본 키 생성을 데이터베이스에 위임합니다(주로 MySQL, PostgreSQL 등에서 사용).
    private Long id;  // 게시글의 고유 ID
    
    private String title;  // 게시글의 제목
    private String content;  // 게시글의 내용
    private String authorNickname;  // 게시글 작성자의 닉네임
    
    private LocalDateTime createDate;  // 게시글 생성 시간
    private LocalDateTime updateDate;  // 게시글 수정 시간
}
