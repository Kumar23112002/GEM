package com.goeazymart.model;

public class Rfq {
    private String id;
    private String buyer;
    private String company;
    private String country;
    private String seller;
    private String product;
    private String qty;
    private String targetPrice;
    private String yourTarget;
    private String status;
    private String received;
    private String sent;
    private String deadline;
    private Integer quotes;

    public Rfq() {}

    public Rfq(String id, String buyer, String company, String country, String seller, String product, String qty, String targetPrice, String yourTarget, String status, String received, String sent, String deadline, Integer quotes) {
        this.id = id;
        this.buyer = buyer;
        this.company = company;
        this.country = country;
        this.seller = seller;
        this.product = product;
        this.qty = qty;
        this.targetPrice = targetPrice;
        this.yourTarget = yourTarget;
        this.status = status;
        this.received = received;
        this.sent = sent;
        this.deadline = deadline;
        this.quotes = quotes;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBuyer() { return buyer; }
    public void setBuyer(String buyer) { this.buyer = buyer; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getSeller() { return seller; }
    public void setSeller(String seller) { this.seller = seller; }

    public String getProduct() { return product; }
    public void setProduct(String product) { this.product = product; }

    public String getQty() { return qty; }
    public void setQty(String qty) { this.qty = qty; }

    public String getTargetPrice() { return targetPrice; }
    public void setTargetPrice(String targetPrice) { this.targetPrice = targetPrice; }

    public String getYourTarget() { return yourTarget; }
    public void setYourTarget(String yourTarget) { this.yourTarget = yourTarget; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReceived() { return received; }
    public void setReceived(String received) { this.received = received; }

    public String getSent() { return sent; }
    public void setSent(String sent) { this.sent = sent; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }

    public Integer getQuotes() { return quotes; }
    public void setQuotes(Integer quotes) { this.quotes = quotes; }
}
