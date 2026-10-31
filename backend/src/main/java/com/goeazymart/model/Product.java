package com.goeazymart.model;

public class Product {
    private Long id;
    private String title;
    private Double price;
    private Double oldPrice;
    private String img;
    private Double rating;
    private Integer reviews;
    private String category;
    private String categoryName;
    private String sku;
    private String seller;
    private String location;
    private Integer stock;
    private String moq;
    private String description;

    public Product() {}

    public Product(Long id, String title, Double price, Double oldPrice, String img, Double rating, Integer reviews, String category, String categoryName, String sku, String seller, String location, Integer stock, String moq, String description) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.oldPrice = oldPrice;
        this.img = img;
        this.rating = rating;
        this.reviews = reviews;
        this.category = category;
        this.categoryName = categoryName;
        this.sku = sku;
        this.seller = seller;
        this.location = location;
        this.stock = stock;
        this.moq = moq;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getOldPrice() { return oldPrice; }
    public void setOldPrice(Double oldPrice) { this.oldPrice = oldPrice; }

    public String getImg() { return img; }
    public void setImg(String img) { this.img = img; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviews() { return reviews; }
    public void setReviews(Integer reviews) { this.reviews = reviews; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getSeller() { return seller; }
    public void setSeller(String seller) { this.seller = seller; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getMoq() { return moq; }
    public void setMoq(String moq) { this.moq = moq; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
