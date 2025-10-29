package com.example.demo.Repos;

import com.example.demo.Entity.RefreshToken;
import com.example.demo.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    @Query("SELECT rt FROM RefreshToken rt WHERE rt.user = :user AND rt.revoked = false AND rt.expiryDate > :now")
    Optional<RefreshToken> findValidByUser(@Param("user") UserEntity user, @Param("now") Instant now);

    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.revoked = true WHERE rt.user = :user")
    void revokeByUser(@Param("user") UserEntity user);

    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiryDate < :now")
    void deleteExpiredTokens(@Param("now") Instant now);
    
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}
