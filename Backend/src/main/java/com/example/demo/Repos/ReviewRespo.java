package com.example.demo.Repos;

import com.example.demo.Entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRespo extends JpaRepository<ReviewEntity, Long> {
    List<ReviewEntity> findByBook_Id(Long bookId);
    long countByUserId(Long userId);
    List<ReviewEntity> findTop5ByUserIdOrderByCreatedAtDesc(Long userId);
    void deleteByUserId(Long userId);
}
