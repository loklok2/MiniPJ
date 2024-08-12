package com.sbs.location.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.location.domain.LocationInfoData;
import com.sbs.location.service.LocationInfoDataService;

@RestController
@RequestMapping("/api/locations")
public class LocationInfoDataController {
    
    @Autowired
    private LocationInfoDataService locationService;
    
    // 모든 위치 정보를 반환하는 엔드포인트
    @GetMapping("/all")
    public ResponseEntity<List<LocationInfoData>> getLocationInfo(){
        // 모든 위치 정보를 반환합니다.
        List<LocationInfoData> locations = locationService.getAllLocationInfo(); // 모든 위치 정보를 가져옴
        return ResponseEntity.ok(locations);    
    }
    
//    // ID로 위치 정보를 조회하는 엔드포인트
//    @GetMapping("/{id}")
//    public ResponseEntity<LocationInfoData> getLocationById(@PathVariable Integer id) {
//        return locationService.getLocationById(id)
//                .map(ResponseEntity::ok)	// 위치 정보가 존재하면 200 OK 응답
//                .orElse(ResponseEntity.notFound().build());	// 위치 정보가 없으면 404 Not Found 응답
//    }
//
//    // 새로운 위치 정보를 생성하는 엔드포인트
//    @PostMapping
//    public LocationInfoData createLocation(@RequestBody LocationInfoData locationInfoData) {
//        return locationService.createLocation(locationInfoData);
//    }
//
//    // ID로 위치 정보를 삭제하는 엔드포인트
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteLocation(@PathVariable Integer id) {
//    	locationService.deleteLocation(id);
//        return ResponseEntity.noContent().build();	// 삭제 성공 시 204 No Content 응답
//    }
 
    
}
