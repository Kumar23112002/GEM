package com.goeazymart.model;

import jakarta.persistence.*;

@Entity
@Table(name = "wishlist_items")
public class WishlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private String title;
    private Double price;
    private Double oldPrice;

    @Column(columnDefinition = "TEXT")
    private String img;

    private Double rating;
    private Integer reviews;
    private String seller;
    private Boolean inStock;
    private String userEmail;

    public WishlistItem() {}

    public WishlistItem(Long id, Long productId, String title, Double price, Double oldPrice, String img, Double rating, Integer reviews, String seller, Boolean inStock, String userEmail) {
        this.id = id;
        this.productId = productId;
        this.title = title;
        this.price = price;
        this.oldPrice = oldPrice;
        this.img = img;
        this.rating = rating;
        this.reviews = reviews;
        this.seller = seller;
        this.inStock = inStock;
        this.userEmail = userEmail;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

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

    public String getSeller() { return seller; }
    public void setSeller(String seller) { this.seller = seller; }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}

