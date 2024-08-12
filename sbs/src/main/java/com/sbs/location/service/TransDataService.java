package com.sbs.location.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sbs.location.domain.TransData;
import com.sbs.location.repository.TransDataRepository;

@Service
public class TransDataService {

	@Autowired
	private TransDataRepository transDataRepo;
	
	public List<TransData> getAllTransDatas() {
		return transDataRepo.findAll();
	}
}
