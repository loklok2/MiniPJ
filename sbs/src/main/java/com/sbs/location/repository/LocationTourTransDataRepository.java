package com.sbs.location.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbs.location.domain.LocationTourTransData;

public interface LocationTourTransDataRepository extends JpaRepository<LocationTourTransData, Integer> {
	
	List<LocationTourTransData> findByKeyId(Integer keyId);
}
