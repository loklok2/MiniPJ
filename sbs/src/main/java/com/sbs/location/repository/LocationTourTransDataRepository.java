package com.sbs.location.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sbs.location.domain.LocationTourTrans;

public interface LocationTourTransDataRepository extends JpaRepository<LocationTourTrans, Integer> {
	
	List<LocationTourTrans> findByKeyId(Integer keyId);
}
