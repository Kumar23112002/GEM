package com.goeazymart.model;

public class User {
    private String id;
    private String email;
    private String password;
    private String role;
    private String name;
    private String avatar;
    private String redirect;
    private String company;
    private String phone;
    private String country;
    private String city;
    private String status;
    private String joined;

    public User() {}

    public User(String id, String email, String password, String role, String name, String avatar, String redirect, String company, String phone, String country, String city, String status, String joined) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.name = name;
        this.avatar = avatar;
        this.redirect = redirect;
        this.company = company;
        this.phone = phone;
        this.country = country;
        this.city = city;
        this.status = status;
        this.joined = joined;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getRedirect() { return redirect; }
    public void setRedirect(String redirect) { this.redirect = redirect; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getJoined() { return joined; }
    public void setJoined(String joined) { this.joined = joined; }
}
