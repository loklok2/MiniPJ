package com.sbs.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sbs.domain.LocationInfoData;

public interface LocationInfoDataRepository extends JpaRepository<LocationInfoData, Integer> {

}
