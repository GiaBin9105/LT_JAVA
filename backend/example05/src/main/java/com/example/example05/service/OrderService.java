package com.example.example05.service;

import com.example.example05.entity.*;
import com.example.example05.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class OrderService {
    @Autowired private OrderRepository orderRepository;
    @Autowired private CartService cartService;
    @Autowired private UserRepository userRepository;

    // 🧾 Thanh toán (checkout)
    public Order checkout(Long userId) {
        Cart cart = cartService.getCart(userId);
        User user = userRepository.findById(userId).orElseThrow();

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống!");
        }

        // ✅ Tính tổng dựa trên priceAtAdd thay vì product.getPrice()
        double total = cart.getItems().stream()
                .mapToDouble(i -> i.getPriceAtAdd() * i.getQuantity())
                .sum();

        Order order = new Order();
        order.setUser(user);
        order.setCreatedAt(LocalDateTime.now());
        order.setTotalPrice(total);
        order.setStatus("PENDING");

        // ✅ Thêm từng item
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPriceAtAdd()); // ✅ dùng giá lúc thêm giỏ
            orderItem.setSize(cartItem.getSize());
            order.getItems().add(orderItem);
        }

        // Lưu đơn hàng
        Order savedOrder = orderRepository.save(order);

        // Xóa giỏ sau khi thanh toán
        cartService.clearCart(userId);

        return savedOrder;
    }

    // 📜 Lấy danh sách đơn hàng của user
    public List<Order> getOrders(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return orderRepository.findByUser(user);
    }
}
