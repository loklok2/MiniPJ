package com.sbs.location.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.location.domain.TransData;
import com.sbs.location.service.TransDataService;

@RestController
@RequestMapping("/api/trans")
public class TransDataController {

	@Autowired
	private TransDataService transDataService;
	
	@GetMapping("/all")
	public ResponseEntity<List<TransData>> getAllTransDatasInfo() {
		List<TransData> transData = transDataService.getAllTransDatas();
		return ResponseEntity.ok(transData);
	}
}
