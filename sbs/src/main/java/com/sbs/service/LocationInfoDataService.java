package com.sbs.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.sbs.domain.LocationInfoData;
import com.sbs.persistence.LocationInfoDataRepository;

@Service
public class LocationInfoDataService {
    
    @Autowired
    private LocationInfoDataRepository locationRepo;
    
    public List<LocationInfoData> getAllLocationInfo(){
        return locationRepo.findAll();
    }

}
