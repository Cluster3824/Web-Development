package com.example.demo.Repos;

import com.example.demo.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    long countByBannedTrue();
    List<UserEntity> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(String username, String email);
}
