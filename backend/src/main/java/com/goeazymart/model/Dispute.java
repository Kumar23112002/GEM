package com.goeazymart.model;

public class Dispute {
    private String id;
    private String orderId;
    private String buyer;
    private String seller;
    private Double amount;
    private String reason;
    private String priority;
    private String status;
    private String opened;
    private String lastUpdate;

    public Dispute() {}

    public Dispute(String id, String orderId, String buyer, String seller, Double amount, String reason, String priority, String status, String opened, String lastUpdate) {
        this.id = id;
        this.orderId = orderId;
        this.buyer = buyer;
        this.seller = seller;
        this.amount = amount;
        this.reason = reason;
        this.priority = priority;
        this.status = status;
        this.opened = opened;
        this.lastUpdate = lastUpdate;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getBuyer() { return buyer; }
    public void setBuyer(String buyer) { this.buyer = buyer; }

    public String getSeller() { return seller; }
    public void setSeller(String seller) { this.seller = seller; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOpened() { return opened; }
    public void setOpened(String opened) { this.opened = opened; }

    public String getLastUpdate() { return lastUpdate; }
    public void setLastUpdate(String lastUpdate) { this.lastUpdate = lastUpdate; }
}
