package com.sbs.location.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sbs.location.domain.TransInfoData;
import com.sbs.location.repository.TransInfoDataRepository;

@Service
public class TransInfoDataService {

	@Autowired
	private TransInfoDataRepository transPortationRepo;
	
	public List<TransInfoData> getAllTransPorations() {
		return transPortationRepo.findAll();
	}
}