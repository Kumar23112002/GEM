package com.goeazymart.controller;

import com.goeazymart.model.Negotiation;
import com.goeazymart.service.MarketplaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/negotiations")
public class NegotiationController {

    private final MarketplaceService service;

    public NegotiationController(MarketplaceService service) {
        this.service = service;
    }

    @GetMapping
    public List<Negotiation> getNegotiations() {
        return service.getNegotiations();
    }

    @PostMapping
    public ResponseEntity<Negotiation> createNegotiation(@RequestBody Negotiation neg) {
        Negotiation created = service.createNegotiation(neg);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/{id}/message")
    public ResponseEntity<Negotiation> sendMessage(
            @PathVariable String id,
            @RequestBody Map<String, Object> body
    ) {
        String text = (String) body.get("text");
        String type = (String) body.getOrDefault("type", "message");
        String amount = body.get("amount") != null ? String.valueOf(body.get("amount")) : null;
        String from = body.get("from") != null ? (String) body.get("from") : (String) body.get("sender");

        Negotiation updated = service.sendNegotiationMessage(id, text, type, amount, from);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    /** Accept, reject, counter, or reopen an active trade negotiation. */
    @PostMapping("/{id}/decision")
    public ResponseEntity<Negotiation> handleDecision(
            @PathVariable String id,
            @RequestBody Map<String, Object> body
    ) {
        String action = body.get("action") != null ? String.valueOf(body.get("action")) : "accept";
        String from = body.get("from") != null ? String.valueOf(body.get("from")) : "buyer";
        String amount = body.get("amount") != null ? String.valueOf(body.get("amount")) : null;
        String text = body.get("text") != null ? String.valueOf(body.get("text")) : null;

        Negotiation updated = service.processNegotiationDecision(id, action, from, amount, text);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
}

