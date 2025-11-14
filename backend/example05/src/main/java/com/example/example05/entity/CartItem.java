package com.example.example05.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE) // ✅ Khi xóa Cart → xóa luôn CartItem
    @JsonBackReference
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // 🧩 Size S, M, L
    private String size;

    // 🔢 Số lượng
    private int quantity;

    // 💰 Giá tại thời điểm thêm vào giỏ
    @Column(name = "price_at_add")
    private Double priceAtAdd;
}
