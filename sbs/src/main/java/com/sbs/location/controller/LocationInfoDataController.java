package com.sbs.location.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.location.domain.LocationInfoDataDTO;
import com.sbs.location.service.LocationInfoDataService;

@RestController
@RequestMapping("/api/locations")
public class LocationInfoDataController {
    
    @Autowired
    private LocationInfoDataService locationService;
    
    @GetMapping("/all")
    public List<LocationInfoDataDTO> getLocationInfo() {
        return locationService.getAllLocationInfo();
    }

    // 이미지 제공을 위한 엔드포인트 추가
    @GetMapping(value = "/image/{id}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getImage(@PathVariable int id) {
        byte[] imageData = locationService.getImageDataById(id);
        if (imageData != null) {
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(imageData);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
