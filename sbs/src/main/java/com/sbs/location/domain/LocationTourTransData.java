package com.sbs.location.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import lombok.Data;

@Entity
@Data
public class LocationTourTransData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int dataNo;  // `DATA_NO`: 자동 증가하는 기본 키

    @Column(name = "KEYID")
    private Integer keyId;  // `KEYID`: 외래 키 관계는 아니지만, 연결된 테이블에 있을 수 있는 키
    
    @Column(name = "Value", length = 45)
    private String value;  // `Value`: 외래 키 관계 설정 없이 문자열 필드로 사용
    
    @Column(name = "PBTRNSP_CL_NM", columnDefinition = "TEXT")
    private String pbtrnspClNm;  // `PBTRNSP_CL_NM`: 대중교통 분류 이름

    @Column(name = "PBTRNSP_FCLTY_NM", columnDefinition = "TEXT")
    private String pbtrnspFcltyNm;  // `PBTRNSP_FCLTY_NM`: 대중교통 시설 이름
    
    @Column(name = "BSTP_NO_NM", columnDefinition = "TEXT")
    private String bstpNoNm;  // `BSTP_NO_NM`: 버스 정류장 번호 이름
    
    @Column(name = "ENTRC_NM", columnDefinition = "TEXT")
    private String entrcNm;  // `ENTRC_NM`: 진입로 이름
    
    @Column(name = "PBTRNSP_FCLTY_ADDR", columnDefinition = "TEXT")
    private String pbtrnspFcltyAddr;  // `PBTRNSP_FCLTY_ADDR`: 대중교통 시설 주소
    
    @Column(name = "FCLTY_LA")
    private Double fcltyLa;  // `FCLTY_LA`: 시설의 위도
    
    @Column(name = "FCLTY_LO")
    private Double fcltyLo;  // `FCLTY_LO`: 시설의 경도
    
    @Column(name = "DSTNC_VALUE")
    private Double dstncValue;  // `DSTNC_VALUE`: 거리 값
}
