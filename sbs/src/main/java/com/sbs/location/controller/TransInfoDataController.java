package com.sbs.location.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.location.domain.TransInfoDataDTO;
import com.sbs.location.service.TransInfoDataService;

@RestController
@RequestMapping("/api/transinfo")
public class TransInfoDataController {

    @Autowired
    private TransInfoDataService transInfoDataService;
    
    @GetMapping("/all")
    public List<TransInfoDataDTO> getAllTransInfo() {
        // 모든 TransInfoData 정보를 DTO로 반환합니다.
        return transInfoDataService.getAllTransPorations();
    }
}
