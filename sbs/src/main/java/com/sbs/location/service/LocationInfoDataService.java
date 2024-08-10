package com.sbs.location.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sbs.location.domain.LocationInfoData;
import com.sbs.location.repository.LocationInfoDataRepository;

@Service
public class LocationInfoDataService {
    
    @Autowired
    private LocationInfoDataRepository locationRepo;
    
    public List<LocationInfoData> getAllLocationInfo(){
        // 모든 위치 정보를 조회합니다.
        return locationRepo.findAll();
    }

}
