package com.sbs.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class LocationInfoData {
    
    @Id
    private int dataNo;
    private String areaClturTrrsrtNm;
    private Double trrsrtLa; 
    private Double trrsrtLo;

}
