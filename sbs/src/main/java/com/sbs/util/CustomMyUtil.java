package com.sbs.util;

import org.springframework.security.oauth2.core.user.OAuth2User;

public class CustomMyUtil {

    // OAuth2User 객체로부터 사용자명을 생성하는 유틸리티 메서드
    public static String getUsernameFromOAuth2User(OAuth2User user) {
        
        // OAuth2User 객체를 문자열로 변환하여 처리
        String userString = user.toString();
        String regName = null;
        
        // OAuth2 공급자별로 이름을 식별하여 regName 변수에 설정
        if (userString.contains("google")) 			regName = "Google";
        else if (userString.contains("facebook")) 	regName = "Facebook";
        else if (userString.contains("naver")) 		regName = "Naver";
        else if (userString.contains("kakao")) 		regName = "Kakao";
        else {
            // 네이버의 경우 특정 문자열이 포함된 경우에만 regName을 설정
            if (userString.contains("id=") && userString.contains("resultcode=") && userString.contains("response="))
                regName = "Naver";
            else
                return null;  // 어떤 공급자에도 해당하지 않는 경우 null 반환
        }

        // 사용자명 (user의 이름)을 가져옴
        String name = user.getName();
        if(name == null) {
            return null;  // 이름이 null인 경우 null 반환
        }
        
        // OAuth2 공급자 이름과 사용자명을 조합하여 반환
        return regName + "_" + name;
    }

}
