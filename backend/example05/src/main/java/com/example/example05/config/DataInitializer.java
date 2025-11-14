package com.example.example05.config;

import com.example.example05.entity.User;
import com.example.example05.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initAdmin(UserRepository userRepository) {
        return args -> {
            String adminEmail = "admin@gmail.com";

            // Nếu chưa tồn tại admin -> tạo mới
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail(adminEmail);
                admin.setPassword(new BCryptPasswordEncoder().encode("1"));
                admin.setRole("ADMIN"); // Thêm role admin

                userRepository.save(admin);
                System.out.println("✅ Created default admin: " + adminEmail);
            } else {
                System.out.println("ℹ️ Admin already exists: " + adminEmail);
            }
        };
    }
}
