package com.sbs.location.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.sbs.location.domain.LocationInfoData;
import com.sbs.location.domain.LocationInfoDataDTO;
import com.sbs.location.repository.LocationInfoDataRepository;

@Service
public class LocationInfoDataService {
    
    @Autowired
    private LocationInfoDataRepository locationRepo;
    
    private final String baseUrl = "http://localhost:8080/api/locations";
    
    public List<LocationInfoDataDTO> getAllLocationInfo() {
        return locationRepo.findAll().stream()
            .map(location -> {
                LocationInfoDataDTO dto = new LocationInfoDataDTO();
                dto.setDataNo(location.getDataNo());
                dto.setKeyId(location.getKeyId());
                dto.setCtprvnNm(location.getCtprvnNm());
                dto.setSignguNm(location.getSignguNm());
                dto.setEmdNm(location.getEmdNm());
                dto.setAreaClturTrrsrtNm(location.getAreaClturTrrsrtNm());
                dto.setAddr(location.getAddr());
                dto.setTrrsrtLa(location.getTrrsrtLa());
                dto.setTrrsrtLo(location.getTrrsrtLo());
                dto.setTrrsrtClNm(location.getTrrsrtClNm());
                dto.setTrrsrtStryNm(location.getTrrsrtStryNm());
                dto.setTrrsrtStrySumryCn(location.getTrrsrtStrySumryCn());
                dto.setTrrsrtStryUrl(location.getTrrsrtStryUrl());
                dto.setCoreKwrdCn(location.getCoreKwrdCn());
                dto.setImageData(location.getImageData());

                // 이미지 URL 설정
                if (location.getImageData() != null) {
                    dto.setImageUrl(baseUrl + "/image/" + location.getDataNo());
                } else {
                    dto.setImageUrl(null);
                }
                
                return dto;
            }).collect(Collectors.toList());
    }
    
    public byte[] getImageDataById(int id) {
        LocationInfoData location = locationRepo.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "이미지를 찾을 수 없습니다."));
        return location.getImageData();
    }
}
