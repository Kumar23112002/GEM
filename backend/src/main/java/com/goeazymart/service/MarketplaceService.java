package com.goeazymart.service;

import com.goeazymart.model.*;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class MarketplaceService {

    private final Map<Long, Product> products = new ConcurrentHashMap<>();
    private final Map<String, User> users = new ConcurrentHashMap<>();
    private final Map<String, Order> orders = new ConcurrentHashMap<>();
    private final Map<String, Rfq> rfqs = new ConcurrentHashMap<>();
    private final Map<Long, Category> categories = new ConcurrentHashMap<>();
    private final Map<String, Dispute> disputes = new ConcurrentHashMap<>();
    private final List<Map<String, Object>> auditLogs = new ArrayList<>();

    @PostConstruct
    public void initData() {
        // Seed Products
        addProduct(new Product(1L, "Aashirvaad Whole Wheat Atta 5kg", 245.0, 300.0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80", 4.5, 320, "retail", "Retail Products", "RTL-ATTA-05", "Punjab Agro Mills", "Ludhiana, Punjab", 350, "1 Bag", "100% pure whole wheat grain flour. Ground with traditional chakki process."));
        addProduct(new Product(2L, "Fortune Sunflower Oil 1L", 162.0, 175.0, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80", 4.0, 120, "retail", "Retail Products", "RTL-OIL-01", "Gujarat Spice Co.", "Ahmedabad, Gujarat", 450, "2 Liters", "Light and healthy refined sunflower cooking oil with Vitamin E."));
        addProduct(new Product(3L, "Tata Salt Vacuum Evaporated 1kg", 28.0, 32.0, "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=600&q=80", 5.0, 85, "retail", "Retail Products", "RTL-SALT-01", "India Grain Co.", "Mumbai, Maharashtra", 1200, "5 Packets", "Iodized vacuum evaporated salt for everyday consumption."));
        addProduct(new Product(4L, "Organic Turmeric Powder 500g", 210.0, 250.0, "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=600&q=80", 4.0, 210, "retail", "Retail Products", "RTL-TURM-500", "Gujarat Spice Co.", "Surat, Gujarat", 180, "2 Packets", "Fresh aromatic turmeric harvested from certified organic farms."));
        addProduct(new Product(5L, "Red Label Tea 500g Blend", 275.0, 310.0, "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80", 4.5, 190, "retail", "Retail Products", "RTL-TEA-500", "Assam Tea Estates", "Guwahati, Assam", 310, "1 Packet", "Rich blend of premium CTC black tea leaves for full-bodied flavor."));
        addProduct(new Product(6L, "Premium Basmati Rice 25kg", 1850.0, 2100.0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80", 4.5, 320, "soft", "Soft Commodities", "RICE-BAS-25", "Punjab Agro Mills", "Ludhiana, Punjab", 245, "5 Bags / 1 MT", "Extra long grain aged basmati rice. Non-sticky texture, rich aroma."));
        addProduct(new Product(7L, "Golden Sella Basmati Rice 10kg", 950.0, 1100.0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80", 4.0, 120, "soft", "Soft Commodities", "RICE-GS-10", "Haryana Rice Traders", "Karnal, Haryana", 120, "10 Bags", "Parboiled golden sella rice grains with superior cooking elongation."));
        addProduct(new Product(11L, "Wheat Grade A - 50kg Industrial Bag", 1200.0, 1400.0, "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80", 4.8, 180, "soft", "Soft Commodities", "WHT-A-50", "Punjab Agro Mills", "Ludhiana, Punjab", 500, "20 Bags / 1 MT", "Grade A Sharbati hard wheat grain. High protein and gluten content."));
        addProduct(new Product(13L, "Aluminium Ingots 99.7% Pure (1 MT)", 220000.0, 235000.0, "https://images.unsplash.com/photo-1535813547086-1e5c4e3c7e8e?auto=format&fit=crop&w=600&q=80", 4.9, 42, "hard", "Hard Commodities", "ALU-ING-1", "Hind Metal Traders", "Bhubaneswar, Odisha", 45, "1 MT", "Standard 99.7% purity commercial primary aluminum ingots with lab test certificate."));
        addProduct(new Product(14L, "Structural Steel Rebars Fe 550D (1 MT)", 54000.0, 58000.0, "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80", 4.8, 64, "hard", "Hard Commodities", "STL-REB-550", "National Steel Corp", "Jamshedpur, Jharkhand", 120, "5 MT", "High ductile earthquake-resistant TMT rebars under IS 1786 specifications."));

        // Seed Users
        users.put("seller@goeazymart.com", new User("U-1002", "seller@goeazymart.com", "seller123", "seller", "Punjab Agro Mills", "https://randomuser.me/api/portraits/men/32.jpg", "/seller-dashboard", "Punjab Agro Mills Pvt Ltd", "+91 98765 43210", "India", "Ludhiana", "active", "2024-03-15"));
        users.put("buyer@goeazymart.com", new User("U-1001", "buyer@goeazymart.com", "buyer123", "buyer", "Priya Sharma", "https://randomuser.me/api/portraits/women/44.jpg", "/buyer-dashboard", "Sharma Trading & Retail", "+91 98765 43210", "India", "Mumbai", "active", "2024-06-20"));
        users.put("admin@goeazymart.com", new User("U-1000", "admin@goeazymart.com", "admin123", "admin", "Super Admin", "https://randomuser.me/api/portraits/men/75.jpg", "/admin-dashboard", "Goeazymart Global HQ", "+91 90000 11111", "India", "New Delhi", "active", "2024-01-10"));

        // Seed Orders
        addOrder(new Order("ORD-2841", "Ahmed Ali", "UAE", "Punjab Agro Mills", "India", "Premium Basmati Rice 25kg", 2, 3700.0, "delivered", "2026-10-14", "Paid", "DHL Express", "DHL845123890", "2026-10-16", 185.0));
        addOrder(new Order("ORD-2840", "Priya Sharma", "India", "Haryana Rice Traders", "India", "Golden Sella Rice 10kg", 1, 950.0, "shipped", "2026-10-15", "Paid", "FedEx", "FDX763219845", "2026-10-18", 48.0));
        addOrder(new Order("ORD-2839", "Ramesh Kumar", "India", "Punjab Agro Mills", "India", "Organic Brown Rice 5kg", 3, 1950.0, "processing", "2026-10-15", "Paid", "BlueDart", "BD984512367", "2026-10-20", 98.0));

        // Seed RFQs
        rfqs.put("RFQ-501", new Rfq("RFQ-501", "Ahmed Ali", "Gulf Foods LLC", "UAE", "Punjab Agro Mills", "Premium Basmati Rice", "1000 MT", "₹1,650/MT", "₹1,600/MT", "pending", "2 hours ago", "2 days ago", "2026-10-20", 3));
        rfqs.put("RFQ-500", new Rfq("RFQ-500", "John Smith", "UK Retail Group", "UK", "Haryana Rice Traders", "Golden Sella Rice", "500 MT", "₹850/MT", "₹1,150/MT", "negotiating", "5 hours ago", "5 days ago", "2026-10-18", 2));

        // Seed Categories
        categories.put(1L, new Category(1L, "Retail Products", "retail", 245, "fa-shopping-basket", "active", "Everyday grocery & household packaged goods"));
        categories.put(2L, new Category(2L, "Soft Commodities", "soft", 312, "fa-leaf", "active", "Grains, rice, wheat, pulses, spices & edible oils"));
        categories.put(3L, new Category(3L, "Hard Commodities", "hard", 89, "fa-cubes", "active", "Industrial metals, structural steel, aluminum, copper"));

        // Seed Disputes
        disputes.put("DSP-1024", new Dispute("DSP-1024", "ORD-2841", "Ahmed Ali", "Punjab Agro Mills", 3700.0, "Quality not as described", "high", "open", "2026-10-15", "2 hours ago"));
        disputes.put("DSP-1023", new Dispute("DSP-1023", "ORD-2836", "Priya Sharma", "Haryana Rice Traders", 950.0, "Late delivery", "medium", "in-review", "2026-10-14", "5 hours ago"));

        // Seed Audit Logs
        Map<String, Object> log1 = new HashMap<>();
        log1.put("id", "AUD-101");
        log1.put("action", "User Login");
        log1.put("user", "admin@goeazymart.com");
        log1.put("role", "admin");
        log1.put("timestamp", "2026-10-25 10:00:00");
        log1.put("ip", "127.0.0.1");
        log1.put("status", "SUCCESS");
        auditLogs.add(log1);

        Map<String, Object> log2 = new HashMap<>();
        log2.put("id", "AUD-102");
        log2.put("action", "Product Catalog Synchronized");
        log2.put("user", "seller@goeazymart.com");
        log2.put("role", "seller");
        log2.put("timestamp", "2026-10-25 10:30:00");
        log2.put("ip", "127.0.0.1");
        log2.put("status", "SUCCESS");
        auditLogs.add(log2);
    }

    // Products
    public List<Product> getAllProducts() { return new ArrayList<>(products.values()); }
    public Product getProductById(Long id) { return products.get(id); }
    public Product addProduct(Product p) {
        if (p.getId() == null) p.setId(System.currentTimeMillis());
        products.put(p.getId(), p);
        return p;
    }
    public Product updateProduct(Long id, Product updates) {
        Product existing = products.get(id);
        if (existing != null) {
            if (updates.getTitle() != null) existing.setTitle(updates.getTitle());
            if (updates.getPrice() != null) existing.setPrice(updates.getPrice());
            if (updates.getStock() != null) existing.setStock(updates.getStock());
            if (updates.getCategory() != null) existing.setCategory(updates.getCategory());
        }
        return existing;
    }
    public boolean deleteProduct(Long id) { return products.remove(id) != null; }

    // Users & Auth
    public User authenticate(String email, String password) {
        User u = users.get(email.trim().toLowerCase());
        if (u != null && u.getPassword().equals(password)) {
            return u;
        }
        return null;
    }
    public User registerUser(User u) {
        if (u.getId() == null) u.setId("U-" + System.currentTimeMillis());
        users.put(u.getEmail().trim().toLowerCase(), u);
        return u;
    }
    public List<User> getAllUsers() { return new ArrayList<>(users.values()); }
    public User updateUserStatus(String userId, String status) {
        for (User u : users.values()) {
            if (u.getId().equals(userId)) {
                u.setStatus(status);
                return u;
            }
        }
        return null;
    }

    // Orders
    public List<Order> getAllOrders() { return new ArrayList<>(orders.values()); }
    public Order addOrder(Order o) {
        if (o.getId() == null) o.setId("ORD-" + (int)(1000 + Math.random() * 9000));
        orders.put(o.getId(), o);
        return o;
    }
    public Order updateOrderStatus(String id, String status) {
        Order o = orders.get(id);
        if (o != null) {
            o.setStatus(status);
            if ("cancelled".equalsIgnoreCase(status)) o.setPayment("Refunded");
        }
        return o;
    }

    // RFQs
    public List<Rfq> getAllRfqs() { return new ArrayList<>(rfqs.values()); }
    public Rfq addRfq(Rfq r) {
        if (r.getId() == null) r.setId("RFQ-" + (int)(500 + Math.random() * 500));
        rfqs.put(r.getId(), r);
        return r;
    }
    public Rfq updateRfqStatus(String id, String status) {
        Rfq r = rfqs.get(id);
        if (r != null) r.setStatus(status);
        return r;
    }

    // Categories
    public List<Category> getAllCategories() { return new ArrayList<>(categories.values()); }
    public Category addCategory(Category c) {
        if (c.getId() == null) c.setId(System.currentTimeMillis());
        categories.put(c.getId(), c);
        return c;
    }

    // Disputes
    public List<Dispute> getAllDisputes() { return new ArrayList<>(disputes.values()); }
    public Dispute updateDisputeStatus(String id, String status) {
        Dispute d = disputes.get(id);
        if (d != null) {
            d.setStatus(status);
            d.setLastUpdate("Just now");
        }
        return d;
    }

    // Audit Logs
    public List<Map<String, Object>> getAuditLogs() {
        return new ArrayList<>(auditLogs);
    }
}
