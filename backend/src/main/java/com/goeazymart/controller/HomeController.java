package com.goeazymart.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping(value = {"/", "/api"})
    public ResponseEntity<Map<String, Object>> getApiStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ONLINE");
        response.put("service", "Goeazymart (GEM) Spring Boot Marketplace Backend");
        response.put("version", "1.0.0");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("data_protection", "Connected to Supabase PostgreSQL Database with JPA Repository Layer");

        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("products", "/api/products");
        endpoints.put("auth_login", "/api/auth/login");
        endpoints.put("auth_register", "/api/auth/register");
        endpoints.put("orders", "/api/orders");
        endpoints.put("rfqs", "/api/rfqs");
        endpoints.put("categories", "/api/categories");
        endpoints.put("buyer_addresses", "/api/buyer/addresses");
        endpoints.put("buyer_payments", "/api/buyer/payments");
        endpoints.put("buyer_wishlist", "/api/buyer/wishlist");
        endpoints.put("negotiations", "/api/negotiations");
        endpoints.put("cms", "/api/cms");
        endpoints.put("leads", "/api/leads");
        endpoints.put("admin_stats", "/api/admin/stats");
        endpoints.put("admin_users", "/api/admin/users");
        endpoints.put("admin_disputes", "/api/admin/disputes");
        endpoints.put("admin_audit", "/api/admin/audit");

        response.put("available_endpoints", endpoints);
        return ResponseEntity.ok(response);
    }
}
