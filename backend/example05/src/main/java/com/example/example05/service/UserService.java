package com.example.example05.service;

import com.example.example05.entity.User;
import com.example.example05.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // 📋 Lấy toàn bộ user (cho admin)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 🔍 Lấy user theo ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // ➕ Thêm user mới
    public User addUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email đã tồn tại!");
        }

        // ✅ Mã hóa mật khẩu
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // ✅ Thiết lập giá trị mặc định
        if (user.getRole() == null || user.getRole().isEmpty()) user.setRole("USER");
        if (user.getAddress() == null) user.setAddress("");
        if (user.getPhone() == null) user.setPhone("");

        return userRepository.save(user);
    }

    // ✏️ Cập nhật user
    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(updatedUser.getName());
                    user.setEmail(updatedUser.getEmail());
                    user.setAddress(updatedUser.getAddress());
                    user.setPhone(updatedUser.getPhone());
                    user.setRole(updatedUser.getRole());

                    // Nếu có mật khẩu mới → mã hoá
                    if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
                        user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                    }
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user để cập nhật!"));
    }

    // 🗑️ Xóa user (đảm bảo không lỗi ràng buộc khóa ngoại)
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user để xóa!"));

        try {
            // ✅ Xóa ràng buộc trước khi xóa user
            if (user.getOrders() != null) user.getOrders().clear();
            if (user.getFavorites() != null) user.getFavorites().clear();

            userRepository.delete(user);
        } catch (Exception e) {
            throw new RuntimeException("Không thể xóa user vì đang có dữ liệu liên quan!");
        }
    }

    // 🔑 Đăng nhập (dùng cho mobile)
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return null;
        }
        return user;
    }
}
