package com.sbs.location.domain;

import lombok.Data;

@Data
public class LocationInfoDataDTO {
    private int dataNo;
    private Integer keyId;
    private String ctprvnNm;
    private String signguNm;
    private String emdNm;
    private String areaClturTrrsrtNm;
    private String addr;
    private Double trrsrtLa;
    private Double trrsrtLo;
    private String trrsrtClNm;
    private String trrsrtStryNm;
    private String trrsrtStrySumryCn;
    private String trrsrtStryUrl;
    private String coreKwrdCn;
    private String imageUrl;
}
