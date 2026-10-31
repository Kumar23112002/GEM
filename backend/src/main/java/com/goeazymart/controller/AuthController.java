package com.goeazymart.controller;

import com.goeazymart.model.User;
import com.goeazymart.service.MarketplaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final MarketplaceService service;

    public AuthController(MarketplaceService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = service.authenticate(email, password);
        Map<String, Object> resp = new HashMap<>();

        if (user != null) {
            resp.put("success", true);
            resp.put("user", user);
            return ResponseEntity.ok(resp);
        } else {
            resp.put("success", false);
            resp.put("message", "Invalid email or password");
            return ResponseEntity.status(401).body(resp);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User created = service.registerUser(user);
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("user", created);
        return ResponseEntity.ok(resp);
    }
}
