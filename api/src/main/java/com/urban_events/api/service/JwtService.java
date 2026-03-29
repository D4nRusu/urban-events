package com.urban_events.api.service;

import java.util.HashMap;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;

import com.urban_events.api.model.User;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    private final long jwtExpiration = 120 * 1000 * 60; // minutes to miliseconds

    public String generateToken(User user) {
        Map<String, Object> fields = new HashMap<>();
        fields.put("role", user.getRole().name());
        fields.put("userName", user.getUserName());

        return Jwts.builder()
                .setClaims(fields)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
