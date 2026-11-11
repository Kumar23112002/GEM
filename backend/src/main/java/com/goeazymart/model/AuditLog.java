package com.goeazymart.model;

import jakarta.persistence.*;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String admin;
    private String action;
    private String target;
    private String time;
    private String type;

    public AuditLog() {}

    public AuditLog(Long id, String admin, String action, String target, String time, String type) {
        this.id = id;
        this.admin = admin;
        this.action = action;
        this.target = target;
        this.time = time;
        this.type = type;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAdmin() { return admin; }
    public void setAdmin(String admin) { this.admin = admin; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}

