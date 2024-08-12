package com.sbs.location.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sbs.location.domain.TransPortation;
import com.sbs.location.repository.TransPortationRepository;

@Service
public class TransPortationService {

	@Autowired
	private TransPortationRepository transPortationRepo;
	
	public List<TransPortation> getAllTransPorations() {
		return transPortationRepo.findAll();
	}
}
