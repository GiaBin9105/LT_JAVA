package com.example.example05.controller;

import com.example.example05.entity.Cart;
import com.example.example05.service.CartService;
import com.example.example05.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class CartController {

    @Autowired private CartRepository cartRepository;
    @Autowired private CartService cartService;

    // ============================ 📦 ADMIN ============================

    // 📜 Lấy tất cả giỏ hàng (cho React Admin)
    @GetMapping("/admin/carts")
    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    // 📜 Lấy giỏ hàng theo ID
    @GetMapping("/admin/carts/{id}")
    public ResponseEntity<?> getCartByIdAdmin(@PathVariable Long id) {
        return cartRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ❌ Xóa giỏ hàng theo ID
    @DeleteMapping("/admin/carts/{id}")
    public ResponseEntity<?> deleteCart(@PathVariable Long id) {
        if (!cartRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Giỏ hàng không tồn tại!"));
        }
        cartRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Đã xóa giỏ hàng thành công!"));
    }

    // ============================ ☕ APP ============================

    // 📦 Lấy giỏ hàng của user
    @GetMapping("/public/carts/{userId}")
    public ResponseEntity<?> getCartByUser(@PathVariable Long userId) {
        try {
            Cart cart = cartService.getCart(userId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ➕ Thêm sản phẩm vào giỏ (có size)
    @PostMapping("/public/carts/{userId}/add/{productId}")
    public ResponseEntity<?> addToCart(
            @PathVariable Long userId,
            @PathVariable Long productId,
            @RequestParam(required = false) String size
    ) {
        try {
            System.out.println("🛒 Thêm vào giỏ: user=" + userId + ", product=" + productId + ", size=" + size);
            Cart updated = cartService.addToCart(userId, productId, size);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ✏️ Cập nhật số lượng sản phẩm
    @PutMapping("/public/carts/item/{cartItemId}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long cartItemId, @RequestParam int quantity) {
        try {
            Cart updated = cartService.updateItem(cartItemId, quantity);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ❌ Xóa 1 sản phẩm khỏi giỏ
    @DeleteMapping("/public/carts/item/{cartItemId}")
    public ResponseEntity<?> removeCartItem(@PathVariable Long cartItemId) {
        try {
            cartService.removeItem(cartItemId);
            return ResponseEntity.ok(Map.of("message", "Đã xóa sản phẩm khỏi giỏ hàng!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🧹 Xóa toàn bộ giỏ hàng của user
    @DeleteMapping("/public/carts/{userId}/clear")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        try {
            cartService.clearCart(userId);
            return ResponseEntity.ok(Map.of("message", "Đã xóa giỏ hàng thành công!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
