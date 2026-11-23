package com.goeazymart.controller;

import com.goeazymart.model.Product;
import com.goeazymart.service.MarketplaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final MarketplaceService service;

    public ProductController(MarketplaceService service) {
        this.service = service;
    }

    @GetMapping
    public List<Product> getProducts(
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "sellerId", required = false) String sellerId,
            @RequestParam(name = "sellerEmail", required = false) String sellerEmail,
            @RequestParam(name = "seller", required = false) String seller) {
        if ((sellerId != null && !sellerId.trim().isEmpty()) ||
            (sellerEmail != null && !sellerEmail.trim().isEmpty()) ||
            (seller != null && !seller.trim().isEmpty())) {
            return service.getProductsBySeller(sellerId, sellerEmail, seller);
        }
        return service.getProductsByCategory(category);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product p = service.getProductById(id);
        if (p != null) return ResponseEntity.ok(p);
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product created = service.addProduct(product);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updates) {
        Product updated = service.updateProduct(id, updates);
        if (updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        boolean removed = service.deleteProduct(id);
        if (removed) return ResponseEntity.ok().build();
        return ResponseEntity.notFound().build();
    }
}
