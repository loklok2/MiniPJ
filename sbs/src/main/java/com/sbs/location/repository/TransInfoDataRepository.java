package com.sbs.location.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sbs.location.domain.TransInfoData;

@Repository
public interface TransInfoDataRepository extends JpaRepository<TransInfoData, Integer> {
    List<TransInfoData> findByValue(String value);
}