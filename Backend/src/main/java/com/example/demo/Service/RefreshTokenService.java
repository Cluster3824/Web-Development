package com.example.demo.Service;

import com.example.demo.Entity.RefreshToken;
import com.example.demo.Entity.UserEntity;
import com.example.demo.Repos.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
//import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    private final long refreshTokenDurationMs = 604800000; // 7 days

    @Transactional
    public RefreshToken createRefreshToken(UserEntity user) {
        // Revoke existing valid tokens for the user
        refreshTokenRepository.revokeByUser(user);

        String token = UUID.randomUUID().toString();
        Instant expiryDate = Instant.now().plusMillis(refreshTokenDurationMs);
        RefreshToken refreshToken = new RefreshToken(token, user, expiryDate);
        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Transactional
    public RefreshToken rotateRefreshToken(RefreshToken oldToken) {
        // Revoke the old token
        oldToken.setRevoked(true);
        refreshTokenRepository.save(oldToken);

        // Create a new one
        return createRefreshToken(oldToken.getUser());
    }

    @Transactional
    public void revokeToken(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    @Transactional
    public void revokeByUser(UserEntity user) {
        refreshTokenRepository.revokeByUser(user);
    }

    public boolean isValid(RefreshToken token) {
        return !token.isRevoked() && token.getExpiryDate().isAfter(Instant.now());
    }

    @Transactional
    public void cleanupExpiredTokens() {
        refreshTokenRepository.deleteExpiredTokens(Instant.now());
    }
}
