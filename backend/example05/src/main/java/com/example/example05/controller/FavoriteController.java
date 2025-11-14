package com.example.example05.controller;

import com.example.example05.entity.Favorite;
import com.example.example05.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/public/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    // 🧾 Lấy danh sách yêu thích của user
    @GetMapping("/{userId}")
    public List<Favorite> getFavorites(@PathVariable Long userId) {
        return favoriteService.getFavorites(userId);
    }

    // ❤️ Thêm sản phẩm yêu thích
    @PostMapping("/{userId}/{productId}")
    public ResponseEntity<?> addFavorite(@PathVariable Long userId, @PathVariable Long productId) {
        try {
            Favorite favorite = favoriteService.addFavorite(userId, productId);
            return ResponseEntity.ok(favorite);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 💔 Xóa sản phẩm khỏi yêu thích
    @DeleteMapping("/{userId}/{productId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Long userId, @PathVariable Long productId) {
        favoriteService.removeFavorite(userId, productId);
        return ResponseEntity.ok().build();
    }
}
