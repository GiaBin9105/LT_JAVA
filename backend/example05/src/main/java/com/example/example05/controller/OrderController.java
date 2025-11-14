package com.example.example05.controller;

import com.example.example05.entity.*;
import com.example.example05.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;

    // 📦 ADMIN — React Admin hiển thị tất cả đơn hàng (dạng dữ liệu phẳng)
    @GetMapping("/admin/orders")
    public List<Map<String, Object>> getAllOrdersForAdmin() {
        List<Order> orders = orderRepository.findAll();

        return orders.stream().map(order -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", order.getId());
            map.put("userName", order.getUser().getName());
            map.put("userEmail", order.getUser().getEmail());
            map.put("totalPrice", order.getTotalPrice());
            map.put("status", order.getStatus());
            map.put("createdAt", order.getCreatedAt());
            map.put("itemCount", order.getItems().size());

            // 🧾 Tạo danh sách item phẳng cho admin hiển thị
            List<Map<String, Object>> items = order.getItems().stream().map(i -> {
                Map<String, Object> itemMap = new LinkedHashMap<>();
                itemMap.put("productName", i.getProduct().getName());
                itemMap.put("size", i.getSize());
                itemMap.put("quantity", i.getQuantity());
                itemMap.put("price", i.getPrice());
                return itemMap;
            }).toList();

            map.put("items", items);
            return map;
        }).toList();
    }

    // 📦 ADMIN — Lấy chi tiết đơn hàng theo ID (cũng phẳng)
    @GetMapping("/admin/orders/{id}")
    public ResponseEntity<?> getOrderDetailForAdmin(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(order -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", order.getId());
                    map.put("userName", order.getUser().getName());
                    map.put("userEmail", order.getUser().getEmail());
                    map.put("totalPrice", order.getTotalPrice());
                    map.put("status", order.getStatus());
                    map.put("createdAt", order.getCreatedAt());

                    // 🧭 Nếu user có địa chỉ và số điện thoại
                    try {
                        map.put("address", order.getUser().getAddress());
                        map.put("phone", order.getUser().getPhone());
                    } catch (Exception ignored) {
                        map.put("address", null);
                        map.put("phone", null);
                    }

                    List<Map<String, Object>> items = order.getItems().stream().map(i -> {
                        Map<String, Object> itemMap = new LinkedHashMap<>();
                        itemMap.put("productName", i.getProduct().getName());
                        itemMap.put("size", i.getSize());
                        itemMap.put("quantity", i.getQuantity());
                        itemMap.put("price", i.getPrice());
                        return itemMap;
                    }).toList();

                    map.put("items", items);
                    return ResponseEntity.ok(map);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 📦 ADMIN — Xóa đơn hàng
    @DeleteMapping("/admin/orders/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        if (!orderRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Đơn hàng không tồn tại!"));
        }
        orderRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Đã xóa đơn hàng thành công!"));
    }

    // ☕ APP — CoffeeShopApp gửi yêu cầu tạo đơn hàng
    public static class OrderRequest {
        public Long userId;
        public Double total;
        public List<OrderItemRequest> items;
    }

    public static class OrderItemRequest {
        public Long productId;
        public Integer quantity;
        public Double price;
        public String size;
    }

    // ✅ API tạo đơn hàng mới
    @PostMapping("/public/orders")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest req) {
        try {
            if (req.items == null || req.items.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Giỏ hàng trống!"));
            }

            User user = userRepository.findById(req.userId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

            Order order = new Order();
            order.setUser(user);
            order.setStatus("PENDING");

            List<OrderItem> orderItems = new ArrayList<>();
            double total = 0.0;

            for (OrderItemRequest i : req.items) {
                Product product = productRepository.findById(i.productId)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm ID " + i.productId));

                OrderItem item = new OrderItem();
                item.setOrder(order);
                item.setProduct(product);
                item.setQuantity(i.quantity);
                item.setPrice(i.price);
                item.setSize(i.size);

                total += i.price * i.quantity;
                orderItems.add(item);
            }

            order.setItems(orderItems);
            order.setTotalPrice(total);
            Order saved = orderRepository.save(order);

            return ResponseEntity.ok(Map.of(
                    "message", "Đơn hàng đã được lưu!",
                    "orderId", saved.getId(),
                    "total", saved.getTotalPrice()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // ☕ APP — Lấy danh sách đơn hàng theo user ID
    @GetMapping("/public/orders/user/{userId}")
    public ResponseEntity<?> getOrdersByUser(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

            List<Order> orders = orderRepository.findByUser(user);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
