package com.sbs.location.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.sbs.location.domain.TransInfoDataDTO;
import com.sbs.location.repository.TransInfoDataRepository;

@Service
public class TransInfoDataService {

    @Autowired
    private TransInfoDataRepository transPortationRepo;

    public List<TransInfoDataDTO> getAllTransPorations() {
        // 모든 TransInfoData 엔티티를 조회하고, DTO로 변환하여 반환합니다.
        List<TransInfoDataDTO> result = transPortationRepo.findAll().stream()
            .map(data -> {
                TransInfoDataDTO dto = new TransInfoDataDTO();
                dto.setDataNo(data.getDataNo());
                dto.setValue(data.getValue());
                dto.setTransPortation(data.getTransPortation());
                return dto;
            }).collect(Collectors.toList());

        if (result.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "교통 정보를 찾을 수 없습니다.");
        }

        return result;
    }
}
