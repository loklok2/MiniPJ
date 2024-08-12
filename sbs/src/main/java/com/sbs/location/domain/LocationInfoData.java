package com.sbs.location.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Data
public class LocationInfoData {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int dataNo;  // `DATA_NO`: 자동 증가하는 기본 키

    @Column(name = "KEYID")
    private Integer keyId;  // `KEYID`: 외래 키, 다른 테이블과의 관계를 나타냄
    
    @Column(name = "CTPRVN_NM")
    private String ctprvnNm;  // `CTPRVN_NM`: 시/도 이름
    
    @Column(name = "SIGNGU_NM")
    private String signguNm;  // `SIGNGU_NM`: 시/군/구 이름
    
    @Column(name = "EMD_NM")
    private String emdNm;  // `EMD_NM`: 읍/면/동 이름
    
    @Column(name = "area_cltur_trrsrt_nm")
    private String areaClturTrrsrtNm;  // `area_cltur_trrsrt_nm`: 문화 관광지 이름
    
    @Column(name = "ADDR")
    private String addr;  // `ADDR`: 주소
    
    @Column(name = "TRRSRT_LA")
    private Double trrsrtLa;  // `TRRSRT_LA`: 관광지의 위도 (Latitude)
    
    @Column(name = "TRRSRT_LO")
    private Double trrsrtLo;  // `TRRSRT_LO`: 관광지의 경도 (Longitude)
    
    @Column(name = "TRRSRT_CL_NM")
    private String trrsrtClNm;  // `TRRSRT_CL_NM`: 관광지 분류 이름
    
    @Column(name = "TRRSRT_STRY_NM")
    private String trrsrtStryNm;  // `TRRSRT_STRY_NM`: 관광지 스토리 이름
    
    @Column(name = "trrsrt_stry_sumry_cn", columnDefinition = "TEXT")
    private String trrsrtStrySumryCn; //관광지 스토리 내용

    @Column(name = "TRRSRT_STRY_URL")
    private String trrsrtStryUrl;  // `TRRSRT_STRY_URL`: 관광지 스토리 URL
    
    @Column(name = "CORE_KWRD_CN")
    private String coreKwrdCn;  // `CORE_KWRD_CN`: 핵심 키워드 내용
}
