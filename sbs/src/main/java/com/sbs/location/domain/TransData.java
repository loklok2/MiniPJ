package com.sbs.location.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "location_tour_trans")		// 데이터베이스의 trans_info_data 테이블과 매핑
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TransData {
	@Id
	private int dataNo;
	private int keyId;
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
