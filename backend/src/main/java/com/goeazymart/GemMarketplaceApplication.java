package com.goeazymart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GemMarketplaceApplication {

    public static void main(String[] args) {
        SpringApplication.run(GemMarketplaceApplication.class, args);
        System.out.println("=============================================================");
        System.out.println("🚀 Goeazymart (GEM) Spring Boot Backend is running on port 8080");
        System.out.println("📡 REST Endpoints: http://localhost:8080/api/products");
        System.out.println("=============================================================");
    }
}
