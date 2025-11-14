package com.example.example05.repository;

import com.example.example05.entity.OrderItem;
import com.example.example05.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // 📦 Lấy tất cả item của 1 đơn hàng
    List<OrderItem> findByOrder(Order order);
}
