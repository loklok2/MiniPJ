package com.sbs.util;

import java.util.Date;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

public class JWTUtil {
    private static final long ACCESS_TOKEN_MSEC = 10 * (60 * 10); // 10분 유지
    private static final String JWT_KEY = "edu.pnu.jwtkey";
    private static final String CLAIM_NAME = "username";
    private static final String PREFIX = "Bearer ";

    private static String getJWTSource(String token) {
        if (token.startsWith(PREFIX)) return token.replace(PREFIX, "");
        return token;
    }

    public static String getJWT(String username) {
        return PREFIX + JWT.create()
                .withClaim(CLAIM_NAME, username)
                .withExpiresAt(new Date(System.currentTimeMillis() + ACCESS_TOKEN_MSEC))
                .sign(Algorithm.HMAC256(JWT_KEY));
    }

    public static String getClaim(String token) {
        String tok = getJWTSource(token);
        return JWT.require(Algorithm.HMAC256(JWT_KEY)).build().verify(tok).getClaim(CLAIM_NAME).asString();
    }

    public static boolean isExpired(String token) {
        String tok = getJWTSource(token);
        return JWT.require(Algorithm.HMAC256(JWT_KEY)).build().verify(tok).getExpiresAt().before(new Date());
    }
}
