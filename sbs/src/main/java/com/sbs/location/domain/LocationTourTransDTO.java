package com.sbs.location.domain;

import lombok.Data;

@Data
public class LocationTourTransDTO {
    private int dataNo;
    private Integer keyId;
    private String value;
    private String pbtrnspClNm;
    private String pbtrnspFcltyNm;
    private String bstpNoNm;
    private String entrcNm;
    private String pbtrnspFcltyAddr;
    private Double fcltyLa;
    private Double fcltyLo;
    private Double dstncValue;
}
