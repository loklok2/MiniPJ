package com.sbs.util;

import java.util.Date;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

public class JWTUtil {
    // JWT 토큰의 유효기간을 10분으로 설정 (밀리초 단위)
    private static final long ACCESS_TOKEN_MSEC = 30 * (60 * 1000); // 10분 유지
    // JWT 토큰 서명에 사용되는 비밀 키
    private static final String JWT_KEY = "edu.pnu.jwtkey";
    // JWT 클레임 이름
    private static final String CLAIM_NAME = "username";
    // 토큰의 접두사, 보통 "Bearer "를 사용
    private static final String PREFIX = "Bearer ";

    // 토큰에서 접두사 "Bearer "를 제거하는 메서드
    private static String getJWTSource(String token) {
        if (token.startsWith(PREFIX)) return token.replace(PREFIX, "");
        return token;
    }

    // 주어진 사용자 이름을 기반으로 JWT 토큰을 생성하는 메서드
    public static String getJWT(String username) {
        return PREFIX + JWT.create()
                .withClaim(CLAIM_NAME, username)
                .withExpiresAt(new Date(System.currentTimeMillis() + ACCESS_TOKEN_MSEC)) // 만료 시간 설정
                .sign(Algorithm.HMAC256(JWT_KEY)); // HMAC256 알고리즘을 사용하여 서명
    }

    // 주어진 토큰에서 사용자 이름 클레임을 추출하는 메서드
    public static String getClaim(String token) {
        String tok = getJWTSource(token);
        return JWT.require(Algorithm.HMAC256(JWT_KEY)).build().verify(tok).getClaim(CLAIM_NAME).asString();
    }

    // 주어진 토큰이 만료되었는지 확인하는 메서드
    public static boolean isExpired(String token) {
        String tok = getJWTSource(token);
        return JWT.require(Algorithm.HMAC256(JWT_KEY)).build().verify(tok).getExpiresAt().before(new Date());
    }
}
