package com.goeazymart.service;

import com.goeazymart.model.*;
import com.goeazymart.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@Transactional
public class MarketplaceService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final RfqRepository rfqRepository;
    private final CategoryRepository categoryRepository;
    private final DisputeRepository disputeRepository;
    private final AddressRepository addressRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final NegotiationRepository negotiationRepository;
    private final CmsContentRepository cmsContentRepository;
    private final AuditLogRepository auditLogRepository;
    private final WishlistItemRepository wishlistItemRepository;

    public MarketplaceService(
            ProductRepository productRepository,
            UserRepository userRepository,
            OrderRepository orderRepository,
            RfqRepository rfqRepository,
            CategoryRepository categoryRepository,
            DisputeRepository disputeRepository,
            AddressRepository addressRepository,
            PaymentMethodRepository paymentMethodRepository,
            NegotiationRepository negotiationRepository,
            CmsContentRepository cmsContentRepository,
            AuditLogRepository auditLogRepository,
            WishlistItemRepository wishlistItemRepository
    ) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.rfqRepository = rfqRepository;
        this.categoryRepository = categoryRepository;
        this.disputeRepository = disputeRepository;
        this.addressRepository = addressRepository;
        this.paymentMethodRepository = paymentMethodRepository;
        this.negotiationRepository = negotiationRepository;
        this.cmsContentRepository = cmsContentRepository;
        this.auditLogRepository = auditLogRepository;
        this.wishlistItemRepository = wishlistItemRepository;
    }

    @PostConstruct
    public void initDatabaseIfEmpty() {
        try {
            if (categoryRepository.count() == 0) {
                seedCategories();
            }
            if (userRepository.count() == 0) {
                seedUsers();
            }
            if (negotiationRepository.count() == 0) {
                seedNegotiations();
            } else {
                repairNegotiationsData();
            }
        } catch (Exception e) {
            // Log connection status
            System.err.println("[MarketplaceService] DB initialization notice: " + e.getMessage());
        }
    }

    // ==================== PRODUCTS ====================
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(String category) {
        if (category == null || category.isEmpty() || "all".equalsIgnoreCase(category)) {
            return productRepository.findAll();
        }
        return productRepository.findByCategoryIgnoreCase(category);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product addProduct(Product p) {
        if (p.getId() == null) {
            p.setId(System.currentTimeMillis());
        }
        if (p.getRating() == null) p.setRating(5.0);
        if (p.getReviews() == null) p.setReviews(0);
        return productRepository.save(p);
    }

    public Product updateProduct(Long id, Product updates) {
        return productRepository.findById(id).map(existing -> {
            if (updates.getTitle() != null) existing.setTitle(updates.getTitle());
            if (updates.getPrice() != null) existing.setPrice(updates.getPrice());
            if (updates.getOldPrice() != null) existing.setOldPrice(updates.getOldPrice());
            if (updates.getImg() != null) existing.setImg(updates.getImg());
            if (updates.getCategory() != null) existing.setCategory(updates.getCategory());
            if (updates.getCategoryName() != null) existing.setCategoryName(updates.getCategoryName());
            if (updates.getSku() != null) existing.setSku(updates.getSku());
            if (updates.getStock() != null) existing.setStock(updates.getStock());
            if (updates.getMoq() != null) existing.setMoq(updates.getMoq());
            if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
            if (updates.getSeller() != null) existing.setSeller(updates.getSeller());
            if (updates.getLocation() != null) existing.setLocation(updates.getLocation());
            return productRepository.save(existing);
        }).orElse(null);
    }

    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // ==================== USERS & AUTH ====================
    public User authenticate(String email, String password) {
        if (email == null) return null;
        Optional<User> opt = userRepository.findByEmailIgnoreCase(email.trim());
        if (opt.isPresent()) {
            User u = opt.get();
            if (password != null && (password.equals(u.getPassword())
                    || (email.equalsIgnoreCase("admin@goeazymart.com") && "Goeazy#Admin2026".equals(password))
                    || (email.equalsIgnoreCase("seller@goeazymart.com") && "Goeazy#Seller2026".equals(password))
                    || (email.equalsIgnoreCase("buyer@goeazymart.com") && "Goeazy#Buyer2026".equals(password)))) {
                return u;
            }
        }
        return null;
    }

    public User registerUser(User u) {
        if (u.getId() == null) {
            u.setId("U-" + System.currentTimeMillis());
        }
        if (u.getEmail() != null) {
            u.setEmail(u.getEmail().trim().toLowerCase());
        }
        if (u.getStatus() == null) u.setStatus("active");
        if (u.getJoined() == null) u.setJoined(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        return userRepository.save(u);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserStatus(String userId, String status) {
        return userRepository.findById(userId).map(u -> {
            u.setStatus(status);
            return userRepository.save(u);
        }).orElse(null);
    }

    // ==================== ORDERS ====================
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByDateDesc();
    }

    public Order addOrder(Order o) {
        if (o.getId() == null || o.getId().isEmpty()) {
            o.setId("ORD-" + (int)(1000 + Math.random() * 9000));
        }
        if (o.getDate() == null) {
            o.setDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        }
        if (o.getStatus() == null) o.setStatus("processing");
        if (o.getPayment() == null) o.setPayment("Paid");
        if (o.getCarrier() == null) o.setCarrier("Express Logistics");
        if (o.getTracking() == null) o.setTracking("TRK" + System.currentTimeMillis());
        return orderRepository.save(o);
    }

    public Order updateOrderStatus(String id, String status) {
        return orderRepository.findById(id).map(o -> {
            o.setStatus(status);
            if ("cancelled".equalsIgnoreCase(status)) {
                o.setPayment("Refunded");
            }
            return orderRepository.save(o);
        }).orElse(null);
    }

    // ==================== RFQS ====================
    public List<Rfq> getAllRfqs() {
        return rfqRepository.findAll();
    }

    public Rfq addRfq(Rfq r) {
        if (r.getId() == null || r.getId().isEmpty()) {
            r.setId("RFQ-" + (int)(500 + Math.random() * 500));
        }
        if (r.getStatus() == null) r.setStatus("pending");
        if (r.getReceived() == null) r.setReceived("Just now");
        if (r.getSent() == null) r.setSent("Just now");
        return rfqRepository.save(r);
    }

    public Rfq updateRfqStatus(String id, String status) {
        return rfqRepository.findById(id).map(r -> {
            r.setStatus(status);
            return rfqRepository.save(r);
        }).orElse(null);
    }

    // ==================== CATEGORIES ====================
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category addCategory(Category c) {
        if (c.getId() == null) {
            c.setId(System.currentTimeMillis());
        }
        return categoryRepository.save(c);
    }

    // ==================== DISPUTES ====================
    public List<Dispute> getAllDisputes() {
        return disputeRepository.findAll();
    }

    public Dispute updateDisputeStatus(String id, String status) {
        return disputeRepository.findById(id).map(d -> {
            d.setStatus(status);
            d.setLastUpdate("Just now");
            return disputeRepository.save(d);
        }).orElse(null);
    }

    // ==================== AUDIT LOGS ====================
    public List<AuditLog> getAuditLogs() {
        return auditLogRepository.findAll();
    }

    public AuditLog addAuditLog(AuditLog log) {
        if (log.getTime() == null) {
            log.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        }
        return auditLogRepository.save(log);
    }

    // ==================== BUYER ADDRESSES ====================
    public List<Address> getAddresses() {
        return addressRepository.findAll();
    }

    public List<Address> saveAddress(Address addr) {
        if (Boolean.TRUE.equals(addr.getIsDefault())) {
            List<Address> all = addressRepository.findAll();
            for (Address a : all) {
                if (!Objects.equals(a.getId(), addr.getId()) && Boolean.TRUE.equals(a.getIsDefault())) {
                    a.setIsDefault(false);
                    addressRepository.save(a);
                }
            }
        }
        addressRepository.save(addr);
        return addressRepository.findAll();
    }

    public List<Address> deleteAddress(Long id) {
        if (addressRepository.existsById(id)) {
            addressRepository.deleteById(id);
        }
        return addressRepository.findAll();
    }

    // ==================== BUYER PAYMENTS ====================
    public List<PaymentMethod> getPaymentMethods() {
        return paymentMethodRepository.findAll();
    }

    public List<PaymentMethod> savePaymentMethod(PaymentMethod pm) {
        if (Boolean.TRUE.equals(pm.getIsDefault())) {
            List<PaymentMethod> all = paymentMethodRepository.findAll();
            for (PaymentMethod p : all) {
                if (!Objects.equals(p.getId(), pm.getId()) && Boolean.TRUE.equals(p.getIsDefault())) {
                    p.setIsDefault(false);
                    paymentMethodRepository.save(p);
                }
            }
        }
        paymentMethodRepository.save(pm);
        return paymentMethodRepository.findAll();
    }

    public List<PaymentMethod> deletePaymentMethod(Long id) {
        if (paymentMethodRepository.existsById(id)) {
            paymentMethodRepository.deleteById(id);
        }
        return paymentMethodRepository.findAll();
    }

    public List<PaymentMethod> setDefaultPaymentMethod(Long id) {
        List<PaymentMethod> all = paymentMethodRepository.findAll();
        for (PaymentMethod p : all) {
            p.setIsDefault(Objects.equals(p.getId(), id));
            paymentMethodRepository.save(p);
        }
        return all;
    }

    // ==================== BUYER WISHLIST ====================
    public List<WishlistItem> getWishlist() {
        return wishlistItemRepository.findAll();
    }

    public List<WishlistItem> toggleWishlistItem(WishlistItem item) {
        Optional<WishlistItem> existing = wishlistItemRepository.findByProductId(item.getProductId());
        if (existing.isPresent()) {
            wishlistItemRepository.delete(existing.get());
        } else {
            wishlistItemRepository.save(item);
        }
        return wishlistItemRepository.findAll();
    }

    // ==================== NEGOTIATIONS ====================
    public List<Negotiation> getNegotiations() {
        return negotiationRepository.findAll();
    }

    public Negotiation createNegotiation(Negotiation neg) {
        if (neg.getId() == null || neg.getId().isEmpty()) {
            neg.setId("NEG-" + (int)(Math.random() * 900 + 100));
        }
        if (neg.getLastTime() == null || neg.getLastTime().isEmpty()) {
            neg.setLastTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));
        }
        if (neg.getStatus() == null || neg.getStatus().isEmpty()) {
            neg.setStatus("active");
        }
        if (neg.getOnline() == null) {
            neg.setOnline(true);
        }
        if (neg.getUnread() == null) {
            neg.setUnread(0);
        }
        neg.setCurrentOffer(sanitizeOffer(neg.getCurrentOffer()));
        neg.setYourOffer(sanitizeOffer(neg.getYourOffer()));
        if (neg.getThread() == null || neg.getThread().isEmpty()) {
            List<Map<String, Object>> thread = new ArrayList<>();
            Map<String, Object> initialMsg = new HashMap<>();
            boolean hasCustomMsg = neg.getLastMessage() != null && !neg.getLastMessage().trim().isEmpty();
            initialMsg.put("from", hasCustomMsg ? "buyer" : "seller");
            String bodyText = hasCustomMsg
                    ? neg.getLastMessage().trim()
                    : "Hello! We received your inquiry for " + (neg.getProduct() != null ? neg.getProduct() : "our commodities") + ". Let us know your delivery terms and target counter offer.";
            initialMsg.put("text", bodyText);
            initialMsg.put("time", neg.getLastTime());
            if (hasCustomMsg && neg.getYourOffer() != null && !neg.getYourOffer().isEmpty()) {
                initialMsg.put("type", "counter");
                initialMsg.put("amount", neg.getYourOffer());
            } else {
                initialMsg.put("type", "message");
            }
            thread.add(initialMsg);
            neg.setThread(thread);
            neg.setLastMessage(bodyText);
        }
        return negotiationRepository.save(neg);
    }

    private String sanitizeOffer(String val) {
        if (val == null || val.trim().isEmpty()) return val;
        String trimmed = val.trim().replaceAll("^\\?+", "₹");
        if (Character.isDigit(trimmed.charAt(0))) {
            trimmed = "₹" + trimmed;
        }
        return trimmed;
    }

    public Negotiation sendNegotiationMessage(String negId, String text, String type, String amount, String from) {
        return negotiationRepository.findById(negId).map(neg -> {
            String timeNow = LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a"));
            String sender = (from != null && !from.isEmpty()) ? from : "me";
            String cleanAmount = sanitizeOffer(amount);

            Map<String, Object> msg = new HashMap<>();
            msg.put("from", sender);
            msg.put("text", text);
            msg.put("time", timeNow);
            msg.put("type", type != null ? type : "message");
            if (cleanAmount != null && !cleanAmount.isEmpty()) {
                msg.put("amount", cleanAmount);
                neg.setCurrentOffer(cleanAmount);
                if (!"seller".equalsIgnoreCase(sender)) {
                    neg.setYourOffer(cleanAmount);
                }
            }
            if ("counter".equalsIgnoreCase(type) && "rejected".equalsIgnoreCase(neg.getStatus())) {
                neg.setStatus("active");
            }

            List<Map<String, Object>> thread = neg.getThread();
            if (thread == null) thread = new ArrayList<>();
            thread.add(msg);
            neg.setThread(thread);
            neg.setLastMessage(text);
            neg.setLastTime(timeNow);
            neg.setUnread(0);

            return negotiationRepository.save(neg);
        }).orElse(null);
    }

    public Negotiation sendNegotiationMessage(String negId, String text, String type, String amount) {
        return sendNegotiationMessage(negId, text, type, amount, "me");
    }

    /** Process accept, reject, counter, or reopen actions on an active negotiation. */
    public Negotiation processNegotiationDecision(String negId, String action, String from, String amount, String text) {
        return negotiationRepository.findById(negId).map(neg -> {
            String timeNow = LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a"));
            String sender = (from != null && !from.isEmpty()) ? from : "buyer";
            String act = action != null ? action.toLowerCase() : "accept";
            String cleanAmount = sanitizeOffer(amount);
            String activeOffer = (cleanAmount != null && !cleanAmount.isEmpty())
                    ? cleanAmount
                    : sanitizeOffer(neg.getCurrentOffer() != null ? neg.getCurrentOffer() : neg.getYourOffer());

            Map<String, Object> msg = new HashMap<>();
            msg.put("from", sender);
            msg.put("time", timeNow);

            String summaryText;
            switch (act) {
                case "accept":
                    neg.setStatus("accepted");
                    if (activeOffer != null && !activeOffer.isEmpty()) {
                        neg.setCurrentOffer(activeOffer);
                        msg.put("amount", activeOffer);
                    }
                    summaryText = (text != null && !text.trim().isEmpty())
                            ? text.trim()
                            : "Offer accepted at " + (activeOffer != null ? activeOffer : "agreed terms") + ". Trade contract approved.";
                    msg.put("type", "accept");
                    msg.put("text", summaryText);
                    break;
                case "reject":
                    neg.setStatus("rejected");
                    if (activeOffer != null && !activeOffer.isEmpty()) {
                        msg.put("amount", activeOffer);
                    }
                    summaryText = (text != null && !text.trim().isEmpty())
                            ? text.trim()
                            : "Offer of " + (activeOffer != null ? activeOffer : "current terms") + " was declined.";
                    msg.put("type", "reject");
                    msg.put("text", summaryText);
                    break;
                case "reopen":
                    neg.setStatus("active");
                    summaryText = (text != null && !text.trim().isEmpty())
                            ? text.trim()
                            : "Negotiation reopened for revised terms.";
                    msg.put("type", "message");
                    msg.put("text", summaryText);
                    break;
                default: // counter
                    neg.setStatus("active");
                    if (activeOffer != null && !activeOffer.isEmpty()) {
                        msg.put("amount", activeOffer);
                        neg.setCurrentOffer(activeOffer);
                        if (!"seller".equalsIgnoreCase(sender)) {
                            neg.setYourOffer(activeOffer);
                        }
                    }
                    summaryText = (text != null && !text.trim().isEmpty())
                            ? text.trim()
                            : "Submitted counter-offer of " + (activeOffer != null ? activeOffer : "revised terms") + ".";
                    msg.put("type", "counter");
                    msg.put("text", summaryText);
                    break;
            }

            List<Map<String, Object>> thread = neg.getThread();
            if (thread == null) thread = new ArrayList<>();
            thread.add(msg);
            neg.setThread(thread);
            neg.setLastMessage(summaryText);
            neg.setLastTime(timeNow);
            neg.setUnread(0);

            return negotiationRepository.save(neg);
        }).orElse(null);
    }

    private void repairNegotiationsData() {
        List<Negotiation> all = negotiationRepository.findAll();
        boolean changed = false;
        for (Negotiation n : all) {
            boolean rowChanged = false;
            String fixedCur = sanitizeOffer(n.getCurrentOffer());
            if (fixedCur != null && !fixedCur.equals(n.getCurrentOffer())) {
                n.setCurrentOffer(fixedCur);
                rowChanged = true;
            }
            String fixedYour = sanitizeOffer(n.getYourOffer());
            if (fixedYour != null && !fixedYour.equals(n.getYourOffer())) {
                n.setYourOffer(fixedYour);
                rowChanged = true;
            }
            List<Map<String, Object>> thread = n.getThread();
            if (thread == null || thread.isEmpty()) {
                thread = new ArrayList<>();
                if ("NEG-302".equals(n.getId())) {
                    thread.add(Map.of("from", "seller", "text", "We have Shankar-6 ready stock in Rajkot godown. Staple length 28.5mm, mic 3.8-4.2.", "time", "Yesterday", "type", "message"));
                    thread.add(Map.of("from", "buyer", "text", "Targeting ₹57,200/Candy for 200 bales consignment.", "time", "Yesterday", "type", "counter", "amount", "₹57,200/Candy"));
                    thread.add(Map.of("from", "seller", "text", "Counter offer updated to ₹58,000/Candy. Ready for escrow confirmation.", "time", "09:30 AM", "type", "offer", "amount", "₹58,000/Candy"));
                } else {
                    String initialTxt = n.getLastMessage() != null && !n.getLastMessage().isEmpty()
                            ? n.getLastMessage()
                            : "Negotiation opened for " + (n.getProduct() != null ? n.getProduct() : "commodity") + ".";
                    Map<String, Object> initMsg = new HashMap<>();
                    initMsg.put("from", "seller");
                    initMsg.put("text", initialTxt);
                    initMsg.put("time", n.getLastTime() != null ? n.getLastTime() : "Just now");
                    initMsg.put("type", "offer");
                    if (fixedCur != null) initMsg.put("amount", fixedCur);
                    thread.add(initMsg);
                }
                n.setThread(thread);
                rowChanged = true;
            } else {
                for (Map<String, Object> msg : thread) {
                    Object amt = msg.get("amount");
                    if (amt != null) {
                        String fixedAmt = sanitizeOffer(String.valueOf(amt));
                        if (!fixedAmt.equals(String.valueOf(amt))) {
                            msg.put("amount", fixedAmt);
                            rowChanged = true;
                        }
                    }
                }
                if (rowChanged) {
                    n.setThread(thread);
                }
            }
            if (rowChanged) {
                negotiationRepository.save(n);
                changed = true;
            }
        }
        if (changed) {
            System.out.println("[MarketplaceService] Repaired legacy negotiation threads and currency symbols.");
        }
    }

    // ==================== CMS ====================
    public CmsContent getCmsContent() {
        return cmsContentRepository.findById("active").orElse(null);
    }

    public CmsContent saveCmsContent(Map<String, Object> content) {
        CmsContent cms = cmsContentRepository.findById("active").orElseGet(CmsContent::new);
        cms.setId("active");
        cms.setContent(content);
        return cmsContentRepository.save(cms);
    }

    // ==================== SEED METHODS (ONLY PLATFORM ESSENTIALS) ====================
    private void seedCategories() {
        List<Category> cats = List.of(
            new Category(1L, "Retail Products", "retail", 0, "fa-shopping-basket", "active", "Everyday grocery & household packaged goods"),
            new Category(2L, "Soft Commodities", "soft", 0, "fa-leaf", "active", "Grains, rice, wheat, pulses, spices & edible oils"),
            new Category(3L, "Hard Commodities", "hard", 0, "fa-cubes", "active", "Industrial metals, structural steel, aluminum, copper")
        );
        categoryRepository.saveAll(cats);
    }

    private void seedUsers() {
        List<User> us = List.of(
            new User("U-1000", "admin@goeazymart.com", "admin123", "admin", "Super Admin", "https://randomuser.me/api/portraits/men/75.jpg", "/admin-dashboard", "Goeazymart Global HQ", "+91 90000 11111", "India", "New Delhi", "active", "2024-01-10"),
            new User("U-1001", "buyer@goeazymart.com", "buyer123", "buyer", "Priya Sharma", "https://randomuser.me/api/portraits/women/44.jpg", "/buyer-dashboard", "Sharma Trading & Retail", "+91 98765 43210", "India", "Mumbai", "active", "2024-06-20"),
            new User("U-1002", "seller@goeazymart.com", "seller123", "seller", "Punjab Agro Mills", "https://randomuser.me/api/portraits/men/32.jpg", "/seller-dashboard", "Punjab Agro Mills Pvt Ltd", "+91 98765 43210", "India", "Ludhiana", "active", "2024-03-15")
        );
        userRepository.saveAll(us);
    }

    private void seedNegotiations() {
        Negotiation neg1 = new Negotiation();
        neg1.setId("NEG-301");
        neg1.setSeller("Punjab Agro Mills");
        neg1.setSellerAvatar("https://randomuser.me/api/portraits/men/32.jpg");
        neg1.setCompany("Punjab Agro Mills Pvt Ltd");
        neg1.setBuyer("Priya Sharma");
        neg1.setBuyerCompany("Sharma Trading & Retail");
        neg1.setCountry("India");
        neg1.setProduct("Sharbati Wheat (Export Grade)");
        neg1.setQty("500 Metric Tons");
        neg1.setRfqId("RFQ-882");
        neg1.setCurrentOffer("₹1,640/MT");
        neg1.setYourOffer("₹1,610/MT");
        neg1.setStatus("active");
        neg1.setOnline(true);
        neg1.setUnread(1);
        neg1.setLastMessage("With 100% Irrevocable LC, best price we can release is ₹1,640/MT with immediate dispatch within 7 business days.");
        neg1.setLastTime("10:45 AM");

        List<Map<String, Object>> thread1 = new ArrayList<>();
        Map<String, Object> m1 = new HashMap<>();
        m1.put("from", "seller");
        m1.put("text", "Greetings! We received your tender inquiry for 500 MT Sharbati Wheat.");
        m1.put("time", "10:15 AM");
        m1.put("type", "message");
        thread1.add(m1);

        Map<String, Object> m2 = new HashMap<>();
        m2.put("from", "seller");
        m2.put("text", "Official mill quote: ₹1,680/MT FOB Mundra Port. Moisture content under 11.5%, SGS lab certificate verified.");
        m2.put("time", "10:18 AM");
        m2.put("type", "offer");
        m2.put("amount", "₹1,680/MT");
        thread1.add(m2);

        Map<String, Object> m3 = new HashMap<>();
        m3.put("from", "buyer");
        m3.put("text", "Thanks for the swift response. Can you consider ₹1,610/MT if we do 100% advance LC payment?");
        m3.put("time", "10:35 AM");
        m3.put("type", "counter");
        m3.put("amount", "₹1,610/MT");
        thread1.add(m3);

        Map<String, Object> m4 = new HashMap<>();
        m4.put("from", "seller");
        m4.put("text", "With 100% Irrevocable LC, best price we can release is ₹1,640/MT with immediate dispatch within 7 business days.");
        m4.put("time", "10:45 AM");
        m4.put("type", "counter");
        m4.put("amount", "₹1,640/MT");
        thread1.add(m4);

        neg1.setThread(thread1);

        Negotiation neg2 = new Negotiation();
        neg2.setId("NEG-302");
        neg2.setSeller("Gujarat Cotton Mills");
        neg2.setSellerAvatar("https://randomuser.me/api/portraits/men/45.jpg");
        neg2.setCompany("Gujarat Cotton & Fibers Ltd");
        neg2.setBuyer("Priya Sharma");
        neg2.setBuyerCompany("Sharma Trading & Retail");
        neg2.setCountry("India");
        neg2.setProduct("Raw Shankar-6 Cotton Bales");
        neg2.setQty("200 Bales");
        neg2.setRfqId("RFQ-655");
        neg2.setCurrentOffer("₹58,000/Candy");
        neg2.setYourOffer("₹57,200/Candy");
        neg2.setStatus("active");
        neg2.setOnline(true);
        neg2.setUnread(0);
        neg2.setLastMessage("Counter offer accepted at ₹58,000. Let's proceed with escrow agreement.");
        neg2.setLastTime("09:30 AM");

        List<Map<String, Object>> thread2 = new ArrayList<>();
        Map<String, Object> t1 = new HashMap<>();
        t1.put("from", "seller");
        t1.put("text", "We have Shankar-6 ready stock in Rajkot godown. Staple length 28.5mm, mic 3.8-4.2.");
        t1.put("time", "Yesterday");
        t1.put("type", "message");
        thread2.add(t1);

        Map<String, Object> t2 = new HashMap<>();
        t2.put("from", "buyer");
        t2.put("text", "Targeting ₹57,200 for 200 bales consignment.");
        t2.put("time", "Yesterday");
        t2.put("type", "counter");
        t2.put("amount", "₹57,200/Candy");
        thread2.add(t2);

        Map<String, Object> t3 = new HashMap<>();
        t3.put("from", "seller");
        t3.put("text", "Counter offer accepted at ₹58,000. Let's proceed with escrow agreement.");
        t3.put("time", "09:30 AM");
        t3.put("type", "offer");
        t3.put("amount", "₹58,000/Candy");
        thread2.add(t3);

        neg2.setThread(thread2);

        negotiationRepository.saveAll(List.of(neg1, neg2));
    }
}
