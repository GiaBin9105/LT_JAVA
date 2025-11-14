package com.example.example05.service;

import com.example.example05.entity.User;
import com.example.example05.repository.UserRepository;
import com.example.example05.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // 🟢 Đăng ký người dùng
    public Map<String, Object> register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email đã tồn tại!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        if (user.getAddress() == null) user.setAddress("");
        if (user.getPhone() == null) user.setPhone("");

        userRepository.save(user);
        return Map.of("message", "Đăng ký thành công!");
    }

    // 🔑 Đăng nhập người dùng
    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Sai email hoặc mật khẩu!");
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        Map<String, Object> res = new HashMap<>();
        res.put("user", user);
        res.put("accessToken", accessToken);
        res.put("refreshToken", refreshToken);
        return res;
    }

    // ♻️ Làm mới access token
    public Map<String, Object> refresh(String refreshToken) {
        if (refreshToken == null || !jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Refresh token không hợp lệ!");
        }

        String email = jwtTokenProvider.getEmailFromToken(refreshToken);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found!"));

        String newAccessToken = jwtTokenProvider.generateAccessToken(user);
        return Map.of("accessToken", newAccessToken);
    }
}
