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
@Table(name = "trans_info_data")		// 데이터베이스의 trans_info_data 테이블과 매핑
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TransPortation {
	@Id
	private int dataNo;
	private String value;
	private String transPortation;
}
