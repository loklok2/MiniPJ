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
@Table(name = "trans_info_data")		// 데이터베이스의 trans_info_data 테이블과 매핑
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TransInfoData {
    @Id
    @Column(name = "DATA_NO")  // 데이터베이스의 컬럼명과 매핑
    private int dataNo;

    @Column(name = "Value", length = 45) // 데이터베이스의 컬럼명과 매핑
    private String value;

    @Column(name = "Transportation") // 데이터베이스의 컬럼명과 매핑
    private String transPortation;
}