package com.sbs.location.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.location.domain.TransPortation;
import com.sbs.location.service.TransPortationService;

@RestController
@RequestMapping("/api/transport")
public class TransPortationController {

	@Autowired
	private TransPortationService transPortationService;
	
	@GetMapping("/all")
	public ResponseEntity<List<TransPortation>> getTransPortationInfo() {
		List<TransPortation> transPortations = transPortationService.getAllTransPorations();
		return ResponseEntity.ok(transPortations);
	}
}
