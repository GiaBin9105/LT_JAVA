package com.example.example05.repository;

import com.example.example05.entity.Favorite;
import com.example.example05.entity.Product;
import com.example.example05.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);
    boolean existsByUserAndProduct(User user, Product product);
    void deleteByUserIdAndProductId(Long userId, Long productId);
}
