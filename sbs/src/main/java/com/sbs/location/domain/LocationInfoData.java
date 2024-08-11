package com.sbs.location.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "location_info_data")		// 데이터베이스의 location_info_data 테이블과 매핑
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class LocationInfoData {
	@Id
    private int dataNo;
	
	@Column(name = "area_cltur_trrsrt_nm", nullable = false)	// 컬럼 이름과 null 비허용 설정
    private String areaClturTrrsrtNm;
    private String addr;
    private Double trrsrtLa;
    private Double trrsrtLo;
	
	@Column(length = 500)  // Description 길이를 제한하여 데이터베이스 성능 향상
    private String trrsrtStrySumryCn;
	
    // 예시: 관광지의 설명 업데이트 로직
    public void updateDescription(String newTrrsrtStrySumryCn) {
        this.trrsrtStrySumryCn = newTrrsrtStrySumryCn;
    }
}
