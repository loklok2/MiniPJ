package com.sbs.location.service;

import java.util.List;
import java.util.Optional;

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
    
    // ID로 위치 정보를 조회하는 메서드
    public Optional<LocationInfoData> getLocationById(Integer id) {
        return locationRepo.findById(id);
    }
    
    // 위치 정보를 생성하는 메서드
    public LocationInfoData createLocation(LocationInfoData locationInfoData) {
        return locationRepo.save(locationInfoData);
    }

    // ID로 위치 정보를 삭제하는 메서드
    public void deleteLocation(Integer id) {
    	locationRepo.deleteById(id);
    }

}
