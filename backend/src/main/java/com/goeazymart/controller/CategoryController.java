package com.goeazymart.controller;

import com.goeazymart.model.Category;
import com.goeazymart.service.MarketplaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final MarketplaceService service;

    public CategoryController(MarketplaceService service) {
        this.service = service;
    }

    @GetMapping
    public List<Category> getCategories() {
        return service.getAllCategories();
    }

    @PostMapping
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        Category created = service.addCategory(category);
        return ResponseEntity.ok(created);
    }
}
