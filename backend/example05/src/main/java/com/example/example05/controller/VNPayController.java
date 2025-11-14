package com.example.example05.controller;

import com.example.example05.entity.Order;
import com.example.example05.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/vnpay")
@CrossOrigin(origins = "*")
public class VNPayController {

    @Autowired
    private OrderRepository orderRepository;

    /**
     * ✅ 1. Tạo link thanh toán VNPay DEMO (sandbox UI)
     * Mục đích: hiển thị giao diện chọn phương thức thanh toán của VNPay (QR, thẻ, ngân hàng).
     */
    @GetMapping("/create")
    public Map<String, String> createDemoPayment(@RequestParam double amount) {
        try {
            // 🔹 URL chính thức của VNPay sandbox demo
            String baseUrl = "https://sandbox.vnpayment.vn/tryitnow/Home/CreateOrder";

            // 🔹 Chỉ cần tham số "amount" hợp lệ là được
            String fullUrl = baseUrl + "?amount=" + URLEncoder.encode(String.valueOf((long) amount), StandardCharsets.UTF_8);

            return Map.of(
                    "url", fullUrl,
                    "message", "VNPay demo sandbox URL (no real payment)",
                    "amount", String.valueOf(amount)
            );

        } catch (Exception e) {
            return Map.of("error", "Failed to generate VNPay demo URL: " + e.getMessage());
        }
    }

    /**
     * ✅ 2. Giả lập callback khi thanh toán demo xong
     * (Thực tế VNPay sẽ gọi lại URL này, ở demo ta chỉ hiển thị thông báo đơn giản)
     */
    @GetMapping("/return")
    public String vnpayReturn(@RequestParam(required = false) String result,
                              @RequestParam(required = false) Long orderId) {

        String statusMessage = "❌ Thanh toán thất bại";
        if ("success".equalsIgnoreCase(result)) {
            statusMessage = "✅ Thanh toán demo VNPay thành công!";
        }

        return """
            <html>
              <head><meta charset='UTF-8'><title>VNPay Demo</title></head>
              <body style='font-family:Arial;text-align:center;margin-top:50px;'>
                <h2>%s</h2>
                <p>Bạn có thể đóng cửa sổ này và quay lại ứng dụng.</p>
              </body>
            </html>
            """.formatted(statusMessage);
    }

    /**
     * ✅ 3. Cập nhật trạng thái đơn hàng (Paid / Failed)
     * Khi thanh toán thành công thì frontend gọi API này để lưu trạng thái.
     */
    @PutMapping("/update-order/{orderId}")
    public Map<String, Object> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam boolean success
    ) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            return Map.of("success", false, "message", "Order not found");
        }

        Order order = orderOpt.get();
        order.setStatus(success ? "Paid (VNPay Demo)" : "Failed (VNPay Demo)");
        orderRepository.save(order);

        return Map.of(
                "success", true,
                "orderId", orderId,
                "status", order.getStatus(),
                "message", success ? "Order marked as paid" : "Order marked as failed"
        );
    }
}
