package com.sbs.location.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.location.domain.LocationTourTransDTO;
import com.sbs.location.service.LocationTourTransDataService;

@RestController
@RequestMapping("/api/tourtrans")
public class LocationTourTransDataController {
	
	@Autowired
	private LocationTourTransDataService locationTourTransDataService;
	
	@GetMapping("/{keyId}")
	// 특정 관광지의 접근 대중교통 위치 정보를 반환합니다.
	public List<LocationTourTransDTO> getTourTransByLocation(@PathVariable Integer keyId) {
		return locationTourTransDataService.getTourTransByLocationKeyId(keyId);
	}
}
