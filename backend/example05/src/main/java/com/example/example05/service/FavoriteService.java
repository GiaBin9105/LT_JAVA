package com.example.example05.service;

import com.example.example05.entity.Favorite;
import com.example.example05.entity.Product;
import com.example.example05.entity.User;
import com.example.example05.repository.FavoriteRepository;
import com.example.example05.repository.ProductRepository;
import com.example.example05.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 🧩 thêm import này

import java.util.List;

@Service
public class FavoriteService {

    @Autowired private FavoriteRepository favoriteRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;

    // 🧾 Lấy danh sách yêu thích theo user
    public List<Favorite> getFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId);
    }

    // ❤️ Thêm sản phẩm yêu thích
    public Favorite addFavorite(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user!"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm!"));

        boolean exists = favoriteRepository.existsByUserAndProduct(user, product);
        if (exists) throw new RuntimeException("Đã yêu thích sản phẩm này rồi!");

        Favorite favorite = new Favorite(null, user, product);
        return favoriteRepository.save(favorite);
    }

    // 💔 Xóa sản phẩm khỏi yêu thích
    @Transactional // 🧩 thêm dòng này để fix lỗi 500
    public void removeFavorite(Long userId, Long productId) {
        favoriteRepository.deleteByUserIdAndProductId(userId, productId);
    }
}
