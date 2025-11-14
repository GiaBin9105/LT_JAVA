package com.example.example05.controller;

import com.example.example05.entity.Category;
import com.example.example05.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    // 🌐 PUBLIC — cho App
    @GetMapping("/public/categories")
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // 🌐 ADMIN — cho React Admin
    @GetMapping("/admin/categories")
    public List<Category> getAllAdmin() {
        return categoryRepository.findAll();
    }

    @GetMapping("/admin/categories/{id}")
    public ResponseEntity<?> getCategoryByIdAdmin(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/admin/categories")
    public ResponseEntity<?> addCategory(@RequestBody Category category) {
        try {
            if (category.getName() == null || category.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Tên danh mục không được để trống"));
            }
            Optional<Category> existing = categoryRepository.findByName(category.getName());
            if (existing.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Tên danh mục đã tồn tại"));
            }
            return ResponseEntity.ok(categoryRepository.save(category));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/admin/categories/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category updatedCategory) {
        try {
            Category existing = categoryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục có ID = " + id));
            existing.setName(updatedCategory.getName());
            return ResponseEntity.ok(categoryRepository.save(existing));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/admin/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            if (!categoryRepository.existsById(id)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Danh mục không tồn tại để xóa!"));
            }
            categoryRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Đã xóa danh mục thành công"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
