package com.sbs.location.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbs.location.domain.LocationInfoData;

public interface LocationInfoDataRepository extends JpaRepository<LocationInfoData, Integer> {
//	Optional<LocationInfoData>
}
