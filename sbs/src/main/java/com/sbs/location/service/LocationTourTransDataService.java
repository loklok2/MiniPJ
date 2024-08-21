package com.sbs.location.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.sbs.location.domain.LocationTourTransDTO;
import com.sbs.location.repository.LocationTourTransDataRepository;

@Service
public class LocationTourTransDataService {

    @Autowired
    private LocationTourTransDataRepository locationTourTransRepo;

    public List<LocationTourTransDTO> getAllLocationInfo() {
        // 모든 대중교통 위치 정보를 조회하고 DTO로 변환하여 반환합니다.
        List<LocationTourTransDTO> result = locationTourTransRepo.findAll().stream()
            .map(location -> {
                LocationTourTransDTO dto = new LocationTourTransDTO();
                dto.setDataNo(location.getDataNo());
                dto.setKeyId(location.getKeyId());
                dto.setValue(location.getValue());
                dto.setPbtrnspClNm(location.getPbtrnspClNm());
                dto.setPbtrnspFcltyNm(location.getPbtrnspFcltyNm());
                dto.setBstpNoNm(location.getBstpNoNm());
                dto.setEntrcNm(location.getEntrcNm());
                dto.setPbtrnspFcltyAddr(location.getPbtrnspFcltyAddr());
                dto.setFcltyLa(location.getFcltyLa());
                dto.setFcltyLo(location.getFcltyLo());
                dto.setDstncValue(location.getDstncValue());
                return dto;
            }).collect(Collectors.toList());

        if (result.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "대중교통 위치 정보를 찾을 수 없습니다.");
        }

        return result;
    }

    public List<LocationTourTransDTO> getTourTransByLocationKeyId(Integer keyId) {
        // 특정 관광지의 대중교통 접근 위치 정보를 조회하고 DTO로 변환하여 반환합니다.
        List<LocationTourTransDTO> result = locationTourTransRepo.findByKeyId(keyId).stream()
            .map(location -> {
                LocationTourTransDTO dto = new LocationTourTransDTO();
                dto.setDataNo(location.getDataNo());
                dto.setKeyId(location.getKeyId());
                dto.setValue(location.getValue());
                dto.setPbtrnspClNm(location.getPbtrnspClNm());
                dto.setPbtrnspFcltyNm(location.getPbtrnspFcltyNm());
                dto.setBstpNoNm(location.getBstpNoNm());
                dto.setEntrcNm(location.getEntrcNm());
                dto.setPbtrnspFcltyAddr(location.getPbtrnspFcltyAddr());
                dto.setFcltyLa(location.getFcltyLa());
                dto.setFcltyLo(location.getFcltyLo());
                dto.setDstncValue(location.getDstncValue());
                return dto;
            }).collect(Collectors.toList());

        if (result.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 키에 대한 대중교통 정보를 찾을 수 없습니다.");
        }

        return result;
    }
}
