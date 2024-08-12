package com.sbs.location.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.location.domain.TransInfoData;
import com.sbs.location.service.TransInfoDataService;

@RestController
@RequestMapping("/api/transport")
public class TransInfoDataController {

	@Autowired
	private TransInfoDataService transInfoDataService;
	
	@GetMapping("/all")
	public ResponseEntity<List<TransInfoData>> getTransPortationInfo() {
		List<TransInfoData> transPortations = transInfoDataService.getAllTransPorations();
		return ResponseEntity.ok(transPortations);
	}
}