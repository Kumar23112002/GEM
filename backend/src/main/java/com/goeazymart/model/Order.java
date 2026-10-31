package com.goeazymart.model;

public class Order {
    private String id;
    private String customer;
    private String buyerCountry;
    private String seller;
    private String sellerCountry;
    private String product;
    private Integer qty;
    private Double amount;
    private String status;
    private String date;
    private String payment;
    private String carrier;
    private String tracking;
    private String expected;
    private Double commission;

    public Order() {}

    public Order(String id, String customer, String buyerCountry, String seller, String sellerCountry, String product, Integer qty, Double amount, String status, String date, String payment, String carrier, String tracking, String expected, Double commission) {
        this.id = id;
        this.customer = customer;
        this.buyerCountry = buyerCountry;
        this.seller = seller;
        this.sellerCountry = sellerCountry;
        this.product = product;
        this.qty = qty;
        this.amount = amount;
        this.status = status;
        this.date = date;
        this.payment = payment;
        this.carrier = carrier;
        this.tracking = tracking;
        this.expected = expected;
        this.commission = commission;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCustomer() { return customer; }
    public void setCustomer(String customer) { this.customer = customer; }

    public String getBuyerCountry() { return buyerCountry; }
    public void setBuyerCountry(String buyerCountry) { this.buyerCountry = buyerCountry; }

    public String getSeller() { return seller; }
    public void setSeller(String seller) { this.seller = seller; }

    public String getSellerCountry() { return sellerCountry; }
    public void setSellerCountry(String sellerCountry) { this.sellerCountry = sellerCountry; }

    public String getProduct() { return product; }
    public void setProduct(String product) { this.product = product; }

    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getPayment() { return payment; }
    public void setPayment(String payment) { this.payment = payment; }

    public String getCarrier() { return carrier; }
    public void setCarrier(String carrier) { this.carrier = carrier; }

    public String getTracking() { return tracking; }
    public void setTracking(String tracking) { this.tracking = tracking; }

    public String getExpected() { return expected; }
    public void setExpected(String expected) { this.expected = expected; }

    public Double getCommission() { return commission; }
    public void setCommission(Double commission) { this.commission = commission; }
}
