package com.goeazymart.model;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "negotiations")
public class Negotiation {

    @Id
    private String id;

    private String seller;

    @Column(columnDefinition = "TEXT")
    private String sellerAvatar;

    private String buyer;
    private String buyerCompany;
    private String company;
    private String country;
    private String product;
    private String qty;
    private String rfqId;

    @Column(columnDefinition = "TEXT")
    private String lastMessage;

    private String lastTime;
    private Integer unread;
    private Boolean online;
    private String status;
    private String currentOffer;
    private String yourOffer;

    @Column(columnDefinition = "TEXT")
    private String threadJson;

    @Transient
    private List<Map<String, Object>> thread = new ArrayList<>();

    private static final ObjectMapper mapper = new ObjectMapper();

    public Negotiation() {}

    @PostLoad
    public void onLoad() {
        if (threadJson != null && !threadJson.isEmpty()) {
            try {
                this.thread = mapper.readValue(threadJson, new TypeReference<List<Map<String, Object>>>() {});
            } catch (Exception e) {
                this.thread = new ArrayList<>();
            }
        }
    }

    @PrePersist
    @PreUpdate
    public void onSave() {
        // Avoid overwriting persisted threadJson during detached JPA merge() when @Transient thread is empty
        if (thread != null && !thread.isEmpty()) {
            try {
                this.threadJson = mapper.writeValueAsString(thread);
            } catch (Exception e) {
                this.threadJson = "[]";
            }
        } else if (this.threadJson == null || this.threadJson.isEmpty()) {
            this.threadJson = "[]";
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSeller() { return seller; }
    public void setSeller(String seller) { this.seller = seller; }

    public String getSellerAvatar() { return sellerAvatar; }
    public void setSellerAvatar(String sellerAvatar) { this.sellerAvatar = sellerAvatar; }

    public String getBuyer() { return buyer; }
    public void setBuyer(String buyer) { this.buyer = buyer; }

    public String getBuyerCompany() { return buyerCompany; }
    public void setBuyerCompany(String buyerCompany) { this.buyerCompany = buyerCompany; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getProduct() { return product; }
    public void setProduct(String product) { this.product = product; }

    public String getQty() { return qty; }
    public void setQty(String qty) { this.qty = qty; }

    public String getRfqId() { return rfqId; }
    public void setRfqId(String rfqId) { this.rfqId = rfqId; }

    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }

    public String getLastTime() { return lastTime; }
    public void setLastTime(String lastTime) { this.lastTime = lastTime; }

    public Integer getUnread() { return unread; }
    public void setUnread(Integer unread) { this.unread = unread; }

    public Boolean getOnline() { return online; }
    public void setOnline(Boolean online) { this.online = online; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCurrentOffer() { return currentOffer; }
    public void setCurrentOffer(String currentOffer) { this.currentOffer = currentOffer; }

    public String getYourOffer() { return yourOffer; }
    public void setYourOffer(String yourOffer) { this.yourOffer = yourOffer; }

    public String getThreadJson() { return threadJson; }
    public void setThreadJson(String threadJson) { this.threadJson = threadJson; }

    public List<Map<String, Object>> getThread() {
        if ((this.thread == null || this.thread.isEmpty())
                && this.threadJson != null && !this.threadJson.isEmpty() && !"[]".equals(this.threadJson)) {
            onLoad();
        }
        return thread;
    }

    public void setThread(List<Map<String, Object>> thread) {
        this.thread = thread != null ? thread : new ArrayList<>();
        try {
            this.threadJson = mapper.writeValueAsString(this.thread);
        } catch (Exception e) {
            this.threadJson = "[]";
        }
    }
}

