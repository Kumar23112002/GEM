package com.goeazymart.controller;

import com.goeazymart.model.Address;
import com.goeazymart.model.PaymentMethod;
import com.goeazymart.model.WishlistItem;
import com.goeazymart.service.MarketplaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buyer")
public class BuyerController {

    private final MarketplaceService service;

    public BuyerController(MarketplaceService service) {
        this.service = service;
    }

    // Addresses
    @GetMapping("/addresses")
    public List<Address> getAddresses() {
        return service.getAddresses();
    }

    @PostMapping("/addresses")
    public List<Address> saveAddress(@RequestBody Address address) {
        return service.saveAddress(address);
    }

    @DeleteMapping("/addresses/{id}")
    public List<Address> deleteAddress(@PathVariable Long id) {
        return service.deleteAddress(id);
    }

    // Payment Methods
    @GetMapping("/payments")
    public List<PaymentMethod> getPaymentMethods() {
        return service.getPaymentMethods();
    }

    @PostMapping("/payments")
    public List<PaymentMethod> savePaymentMethod(@RequestBody PaymentMethod paymentMethod) {
        return service.savePaymentMethod(paymentMethod);
    }

    @DeleteMapping("/payments/{id}")
    public List<PaymentMethod> deletePaymentMethod(@PathVariable Long id) {
        return service.deletePaymentMethod(id);
    }

    @PutMapping("/payments/{id}/default")
    public List<PaymentMethod> setDefaultPaymentMethod(@PathVariable Long id) {
        return service.setDefaultPaymentMethod(id);
    }

    // Wishlist
    @GetMapping("/wishlist")
    public List<WishlistItem> getWishlist() {
        return service.getWishlist();
    }

    @PostMapping("/wishlist")
    public List<WishlistItem> toggleWishlistItem(@RequestBody WishlistItem item) {
        return service.toggleWishlistItem(item);
    }
}

