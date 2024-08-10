package com.sbs.location.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.location.domain.LocationInfoData;
import com.sbs.location.service.LocationInfoDataService;

@RestController
@RequestMapping("/api/locations")
public class LocationInfoDataController {
    
    @Autowired
    private LocationInfoDataService locationService;
    
    @GetMapping("/all")
    public List<LocationInfoData> getLocationInfo(){
        // 모든 위치 정보를 반환합니다.
        return locationService.getAllLocationInfo();
    }
    
}
