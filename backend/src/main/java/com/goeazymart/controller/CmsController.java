package com.goeazymart.controller;

import com.goeazymart.model.CmsContent;
import com.goeazymart.service.MarketplaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cms")
public class CmsController {

    private final MarketplaceService service;

    public CmsController(MarketplaceService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<?> getCms() {
        CmsContent content = service.getCmsContent();
        if (content != null) {
            return ResponseEntity.ok(content.getContent());
        }
        return ResponseEntity.ok(Map.of());
    }

    @PostMapping
    public ResponseEntity<?> updateCms(@RequestBody Map<String, Object> body) {
        CmsContent saved = service.saveCmsContent(body);
        return ResponseEntity.ok(saved.getContent());
    }
}

