package com.example.example05.service;

import com.example.example05.entity.*;
import com.example.example05.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class CartService {

    @Autowired private CartRepository cartRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;

    // 🛒 Lấy giỏ hàng theo user
    public Cart getCart(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();

        // Nếu user chưa có cart thì tạo mới
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
    }

    // ➕ Thêm sản phẩm vào giỏ (hỗ trợ size + giá theo size)
    public Cart addToCart(Long userId, Long productId, String size) {
        Cart cart = getCart(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        // Chọn giá theo size
        Double selectedPrice = switch (size != null ? size.toUpperCase() : "M") {
            case "S" -> product.getPriceS();
            case "L" -> product.getPriceL();
            default -> product.getPriceM();
        };

        // Tìm xem sản phẩm cùng size đã có chưa
        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProduct().equals(product)
                        && Objects.equals(i.getSize(), size))
                .findFirst();

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + 1);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setSize(size != null ? size : "M");
            newItem.setQuantity(1);
            newItem.setPriceAtAdd(selectedPrice); // ✅ lưu giá ngay khi thêm
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    // ✏️ Cập nhật số lượng sản phẩm
    public Cart updateItem(Long cartItemId, int quantity) {
        CartItem item = cartItemRepository.findById(cartItemId).orElseThrow();
        item.setQuantity(quantity);
        cartItemRepository.save(item);
        return item.getCart();
    }

    // 🗑️ Xóa 1 sản phẩm khỏi giỏ
    public void removeItem(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    // ❌ Xóa toàn bộ giỏ hàng
    public void clearCart(Long userId) {
        Cart cart = getCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
