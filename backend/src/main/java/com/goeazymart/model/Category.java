package com.goeazymart.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String slug;
    private Integer products;
    private String icon;
    private String status;

    @Column(name = "description", columnDefinition = "TEXT")
    @JsonProperty("desc")
    private String desc;

    public Category() {}

    public Category(Long id, String name, String slug, Integer products, String icon, String status, String desc) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.products = products;
        this.icon = icon;
        this.status = status;
        this.desc = desc;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public Integer getProducts() { return products; }
    public void setProducts(Integer products) { this.products = products; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDesc() { return desc; }
    public void setDesc(String desc) { this.desc = desc; }
}
