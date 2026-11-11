package com.goeazymart.model;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "cms_content")
public class CmsContent {

    @Id
    private String id = "active";

    @Column(columnDefinition = "TEXT")
    private String contentJson;

    @Transient
    private Map<String, Object> content = new HashMap<>();

    private static final ObjectMapper mapper = new ObjectMapper();

    public CmsContent() {}

    public CmsContent(String id, Map<String, Object> content) {
        this.id = id;
        this.content = content;
        onSave();
    }

    @PostLoad
    public void onLoad() {
        if (contentJson != null && !contentJson.isEmpty()) {
            try {
                this.content = mapper.readValue(contentJson, new TypeReference<Map<String, Object>>() {});
            } catch (Exception e) {
                this.content = new HashMap<>();
            }
        }
    }

    @PrePersist
    @PreUpdate
    public void onSave() {
        if (content != null && !content.isEmpty()) {
            try {
                this.contentJson = mapper.writeValueAsString(content);
            } catch (Exception e) {
                this.contentJson = "{}";
            }
        } else if (this.contentJson == null || this.contentJson.isEmpty()) {
            this.contentJson = "{}";
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getContentJson() { return contentJson; }
    public void setContentJson(String contentJson) { this.contentJson = contentJson; }

    public Map<String, Object> getContent() {
        if ((this.content == null || this.content.isEmpty())
                && this.contentJson != null && !this.contentJson.isEmpty() && !"{}".equals(this.contentJson)) {
            onLoad();
        }
        return content;
    }

    public void setContent(Map<String, Object> content) {
        this.content = content != null ? content : new HashMap<>();
        try {
            this.contentJson = mapper.writeValueAsString(this.content);
        } catch (Exception e) {
            this.contentJson = "{}";
        }
    }
}

