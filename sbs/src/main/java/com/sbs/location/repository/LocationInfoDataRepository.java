package com.sbs.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbs.location.domain.LocationInfoData;

public interface LocationInfoDataRepository extends JpaRepository<LocationInfoData, Integer> {
	// JpaRepository를 상속받아 기본적인 CRUD 연산을 지원
}
