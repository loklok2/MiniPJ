package com.sbs.location.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sbs.location.domain.LocationTourTrans;
import com.sbs.location.repository.LocationTourTransDataRepository;

@Service
public class LocationTourTransDataService {
    
    @Autowired
    private LocationTourTransDataRepository LocationTourTransRepo;
    
    public List<LocationTourTrans> getAllLocationInfo(){
        // 모든 대중교통 위치 조회
        return LocationTourTransRepo.findAll();
    }
    
    
    
    public List<LocationTourTrans> getTourTransByLocationKeyId(Integer keyId){
    	//특정 관광지의 대중교통 접근 위치 조회
    	return LocationTourTransRepo.findByKeyId(keyId);
    }
    
}
