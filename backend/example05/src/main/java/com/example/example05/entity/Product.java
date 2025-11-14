package com.example.example05.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String image;

    // 💰 Giá theo size
    @Column(nullable = false)
    private Double priceS;

    @Column(nullable = false)
    private Double priceM;

    @Column(nullable = false)
    private Double priceL;

    // ⭐️ Đánh giá trung bình
    @Column(nullable = false)
    private Double rating = 4.5;

    // ⚙️ Liên kết với Category (nhiều sản phẩm thuộc 1 category)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties("products")
    private Category category;
}
