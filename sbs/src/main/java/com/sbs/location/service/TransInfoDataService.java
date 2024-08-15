package com.sbs.location.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sbs.location.domain.TransInfoData;
import com.sbs.location.domain.TransInfoDataDTO;
import com.sbs.location.repository.TransInfoDataRepository;

@Service
public class TransInfoDataService {

	@Autowired
	private TransInfoDataRepository transPortationRepo;
	
	public List<TransInfoDataDTO> getAllTransPorations() {
		// 모든 TransInfoData 엔티티를 조회하고, DTO로 변환하여 반환합니다.
		return transPortationRepo.findAll().stream()
		    .map(data -> {
		        TransInfoDataDTO dto = new TransInfoDataDTO();
		        dto.setDataNo(data.getDataNo());
		        dto.setValue(data.getValue());
		        dto.setTransPortation(data.getTransPortation());
		        return dto;
		    }).collect(Collectors.toList());
	}
}
