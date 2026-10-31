package com.goeazymart.controller;

import com.goeazymart.model.Rfq;
import com.goeazymart.service.MarketplaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rfqs")
public class RfqController {

    private final MarketplaceService service;

    public RfqController(MarketplaceService service) {
        this.service = service;
    }

    @GetMapping
    public List<Rfq> getRfqs() {
        return service.getAllRfqs();
    }

    @PostMapping
    public ResponseEntity<Rfq> createRfq(@RequestBody Rfq rfq) {
        Rfq created = service.addRfq(rfq);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Rfq> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        Rfq updated = service.updateRfqStatus(id, status);
        if (updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }
}
