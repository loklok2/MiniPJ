package com.sbs.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.domain.LocationInfoData;
import com.sbs.service.LocationInfoDataService;

@RestController
@RequestMapping("/api/locations")
public class LocationInfoDataController {
    
    @Autowired
    private LocationInfoDataService locationService;
    
    @GetMapping("/all")
    public List<LocationInfoData> getLocationInfo(){
        return locationService.getAllLocationInfo();
    }
    
}
