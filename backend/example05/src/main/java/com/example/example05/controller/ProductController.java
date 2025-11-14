package com.example.example05.controller;

import com.example.example05.entity.Product;
import com.example.example05.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.*;
import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // ============================ 🌐 PUBLIC (Cho App) ============================

    @GetMapping("/public/products")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/public/products/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ============================ 🌐 ADMIN (Cho React Admin) ============================

    @GetMapping("/admin/products")
    public List<Product> getAllAdmin() {
        return productRepository.findAll();
    }

    @GetMapping("/admin/products/{id}")
    public ResponseEntity<?> getProductByIdAdmin(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🟢 Tạo sản phẩm mới
    @PostMapping("/admin/products")
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        try {
            if (product.getName() == null || product.getName().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Tên sản phẩm không được để trống"));
            }

            // ✅ Bắt buộc có giá cho từng size
            if (product.getPriceS() == null || product.getPriceM() == null || product.getPriceL() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Vui lòng nhập đủ giá cho S, M, L"));
            }

            // ✅ Nếu rating null thì mặc định là 4.5
            if (product.getRating() == null) {
                product.setRating(4.5);
            }

            Product saved = productRepository.save(product);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // 🟡 Cập nhật sản phẩm
    @PutMapping("/admin/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        try {
            Product existing = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm có ID = " + id));

            existing.setName(updatedProduct.getName());
            existing.setDescription(updatedProduct.getDescription());
            existing.setImage(updatedProduct.getImage());
            existing.setCategory(updatedProduct.getCategory());
            existing.setRating(updatedProduct.getRating() != null ? updatedProduct.getRating() : 4.5);

            // ✅ Cập nhật giá S/M/L
            existing.setPriceS(updatedProduct.getPriceS());
            existing.setPriceM(updatedProduct.getPriceM());
            existing.setPriceL(updatedProduct.getPriceL());

            Product saved = productRepository.save(existing);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔴 Xóa sản phẩm
    @DeleteMapping("/admin/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Sản phẩm không tồn tại để xóa!"));
        }
        productRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Đã xóa sản phẩm thành công!"));
    }

    // 🖼️ Upload ảnh
    @PostMapping("/admin/products/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String folder = System.getProperty("user.dir") + "/uploads/";
            File uploadDir = new File(folder);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get(folder + filename);
            Files.write(path, file.getBytes());

            // ⚠️ Đổi IP LAN thật khi test
            String imageUrl = "http://192.168.220.177:8080/uploads/" + filename;

            return ResponseEntity.ok(Map.of("url", imageUrl));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
