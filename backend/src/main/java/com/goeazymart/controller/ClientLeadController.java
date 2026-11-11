package com.goeazymart.controller;

import com.goeazymart.model.ClientLead;
import com.goeazymart.service.MarketplaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leads")
public class ClientLeadController {

    private final MarketplaceService service;

    public ClientLeadController(MarketplaceService service) {
        this.service = service;
    }

    @GetMapping
    public List<ClientLead> getAllLeads() {
        return service.getAllClientLeads();
    }

    @PostMapping
    public ResponseEntity<?> createLead(@RequestBody ClientLead lead) {
        boolean hasEmail = lead.getEmail() != null && !lead.getEmail().trim().isEmpty();
        boolean hasPhone = lead.getPhone() != null && !lead.getPhone().trim().isEmpty();
        boolean hasWhatsapp = lead.getWhatsapp() != null && !lead.getWhatsapp().trim().isEmpty();

        if (!hasEmail && !hasPhone && !hasWhatsapp) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Please provide at least an email address, phone number, or WhatsApp number."
            ));
        }

        ClientLead saved = service.createClientLead(lead);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLead(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        ClientLead updated = service.updateClientLead(id, updates);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLead(@PathVariable Long id) {
        if (service.deleteClientLead(id)) {
            return ResponseEntity.ok(Map.of("deleted", id));
        }
        return ResponseEntity.notFound().build();
    }
}
