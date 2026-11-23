package com.goeazymart.controller;

import com.goeazymart.model.Order;
import com.goeazymart.service.MarketplaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final MarketplaceService service;

    public OrderController(MarketplaceService service) {
        this.service = service;
    }

    @GetMapping
    public List<Order> getOrders(
            @RequestParam(name = "sellerId", required = false) String sellerId,
            @RequestParam(name = "sellerEmail", required = false) String sellerEmail,
            @RequestParam(name = "seller", required = false) String seller) {
        if ((sellerId != null && !sellerId.trim().isEmpty()) ||
            (sellerEmail != null && !sellerEmail.trim().isEmpty()) ||
            (seller != null && !seller.trim().isEmpty())) {
            return service.getOrdersBySeller(sellerId, sellerEmail, seller);
        }
        return service.getAllOrders();
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order created = service.addOrder(order);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        Order updated = service.updateOrderStatus(id, status);
        if (updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }
}
