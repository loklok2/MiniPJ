package com.sbs.location.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.location.domain.LocationTourTrans;
import com.sbs.location.service.LocationTourTransService;

@RestController
@RequestMapping("/api/tourtrans")
public class LocationTourTransController {
	
	@Autowired
	private LocationTourTransService locationTourTransService;
	
	@GetMapping("/all")
    public ResponseEntity<List<LocationTourTrans>> getTourTransByLocation(){
        // 모든 위치 정보를 반환합니다.
        List<LocationTourTrans> locations = locationTourTransService.getAllLocationInfo();
        return ResponseEntity.ok(locations);    
    }
	
	@GetMapping("/{keyId}")
	//특정 관광지의 접근 대중교통 위치
	public List<LocationTourTrans> getTourTransByLocation(@PathVariable Integer keyId) {
		return locationTourTransService.getTourTransByLocationKeyId(keyId);
	}

}
