package com.goeazymart.controller;

import com.goeazymart.model.Dispute;
import com.goeazymart.model.User;
import com.goeazymart.service.MarketplaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final MarketplaceService service;

    public AdminController(MarketplaceService service) {
        this.service = service;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        List<User> users = service.getAllUsers();
        stats.put("totalUsers", users.size());
        stats.put("buyers", users.stream().filter(u -> "buyer".equalsIgnoreCase(u.getRole())).count());
        stats.put("sellers", users.stream().filter(u -> "seller".equalsIgnoreCase(u.getRole())).count());
        stats.put("totalRevenue", 24000000);
        return stats;
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return service.getAllUsers();
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<User> updateUserStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        User updated = service.updateUserStatus(id, status);
        if (updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/disputes")
    public List<Dispute> getDisputes() {
        return service.getAllDisputes();
    }

    @PutMapping("/disputes/{id}/status")
    public ResponseEntity<Dispute> updateDisputeStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        Dispute updated = service.updateDisputeStatus(id, status);
        if (updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/audit")
    public List<Map<String, Object>> getAuditLogs() {
        return service.getAuditLogs();
    }
}
