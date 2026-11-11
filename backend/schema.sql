-- ====================================================================
-- Goeazymart (GEM) - Supabase PostgreSQL Database Schema & Initial Data
-- Run this script directly in the Supabase SQL Editor if needed
-- ====================================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    old_price NUMERIC(12, 2),
    img TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    reviews INTEGER DEFAULT 0,
    category VARCHAR(100),
    category_name VARCHAR(150),
    sku VARCHAR(100),
    seller VARCHAR(255),
    location VARCHAR(255),
    stock INTEGER DEFAULT 0,
    moq VARCHAR(100),
    description TEXT
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    name VARCHAR(255),
    avatar TEXT,
    redirect VARCHAR(255),
    company VARCHAR(255),
    phone VARCHAR(50),
    country VARCHAR(100),
    city VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    joined VARCHAR(50)
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY,
    customer VARCHAR(255),
    customer_country VARCHAR(100),
    seller VARCHAR(255),
    seller_country VARCHAR(100),
    item VARCHAR(255),
    qty INTEGER,
    amount NUMERIC(12, 2),
    status VARCHAR(50),
    date VARCHAR(50),
    payment VARCHAR(50),
    carrier VARCHAR(100),
    tracking VARCHAR(100),
    expected VARCHAR(50),
    commission NUMERIC(12, 2)
);

-- 4. RFQS TABLE
CREATE TABLE IF NOT EXISTS rfqs (
    id VARCHAR(100) PRIMARY KEY,
    buyer VARCHAR(255),
    company VARCHAR(255),
    country VARCHAR(100),
    seller VARCHAR(255),
    product VARCHAR(255),
    qty VARCHAR(100),
    target_price VARCHAR(100),
    quoted_price VARCHAR(100),
    status VARCHAR(50),
    received VARCHAR(50),
    sent VARCHAR(50),
    deadline VARCHAR(50),
    quotes INTEGER DEFAULT 1
);

-- 5. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    count INTEGER DEFAULT 0,
    icon VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    description TEXT
);

-- 6. DISPUTES TABLE
CREATE TABLE IF NOT EXISTS disputes (
    id VARCHAR(100) PRIMARY KEY,
    order_id VARCHAR(100),
    claimant VARCHAR(255),
    respondent VARCHAR(255),
    amount NUMERIC(12, 2),
    reason TEXT,
    priority VARCHAR(50),
    status VARCHAR(50),
    date VARCHAR(50),
    last_update VARCHAR(50)
);

-- 7. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS addresses (
    id BIGSERIAL PRIMARY KEY,
    label VARCHAR(100),
    name VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip VARCHAR(50),
    country VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE
);

-- 8. PAYMENT METHODS TABLE
CREATE TABLE IF NOT EXISTS payment_methods (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50),
    brand VARCHAR(100),
    name VARCHAR(255),
    last4 VARCHAR(10),
    expiry VARCHAR(20),
    upi_id VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE
);

-- 9. NEGOTIATIONS TABLE
CREATE TABLE IF NOT EXISTS negotiations (
    id VARCHAR(100) PRIMARY KEY,
    seller VARCHAR(255),
    seller_avatar TEXT,
    company VARCHAR(255),
    country VARCHAR(100),
    product VARCHAR(255),
    qty VARCHAR(100),
    rfq_id VARCHAR(100),
    last_message TEXT,
    last_time VARCHAR(50),
    unread INTEGER DEFAULT 0,
    online BOOLEAN DEFAULT TRUE,
    status VARCHAR(50),
    current_offer VARCHAR(100),
    your_offer VARCHAR(100),
    thread_json TEXT
);

-- 10. CMS CONTENT TABLE
CREATE TABLE IF NOT EXISTS cms_content (
    id VARCHAR(100) PRIMARY KEY,
    content_json TEXT
);

-- 11. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    admin VARCHAR(255),
    action VARCHAR(255),
    target VARCHAR(255),
    time VARCHAR(50),
    type VARCHAR(50)
);

-- 12. WISHLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS wishlist_items (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT,
    title VARCHAR(255),
    price NUMERIC(12, 2),
    old_price NUMERIC(12, 2),
    img TEXT,
    rating NUMERIC(3, 2),
    reviews INTEGER,
    seller VARCHAR(255),
    in_stock BOOLEAN DEFAULT TRUE,
    user_email VARCHAR(255)
);

-- ====================================================================
-- SEED DATA (Only essential platform categories and login accounts)
-- Dummy products, orders, and rfqs removed as requested.
-- ====================================================================

-- Users
INSERT INTO users (id, email, password, role, name, avatar, redirect, company, phone, country, city, status, joined)
VALUES
('U-1000', 'admin@goeazymart.com', 'admin123', 'admin', 'Super Admin', 'https://randomuser.me/api/portraits/men/75.jpg', '/admin-dashboard', 'Goeazymart Global HQ', '+91 90000 11111', 'India', 'New Delhi', 'active', '2024-01-10'),
('U-1001', 'buyer@goeazymart.com', 'buyer123', 'buyer', 'Priya Sharma', 'https://randomuser.me/api/portraits/women/44.jpg', '/buyer-dashboard', 'Sharma Trading & Retail', '+91 98765 43210', 'India', 'Mumbai', 'active', '2024-06-20'),
('U-1002', 'seller@goeazymart.com', 'seller123', 'seller', 'Punjab Agro Mills', 'https://randomuser.me/api/portraits/men/32.jpg', '/seller-dashboard', 'Punjab Agro Mills Pvt Ltd', '+91 98765 43210', 'India', 'Ludhiana', 'active', '2024-03-15')
ON CONFLICT (email) DO NOTHING;

-- Categories
INSERT INTO categories (id, name, slug, count, icon, status, description)
VALUES
(1, 'Retail Products', 'retail', 0, 'fa-shopping-basket', 'active', 'Everyday grocery & household packaged goods'),
(2, 'Soft Commodities', 'soft', 0, 'fa-leaf', 'active', 'Grains, rice, wheat, pulses, spices & edible oils'),
(3, 'Hard Commodities', 'hard', 0, 'fa-cubes', 'active', 'Industrial metals, structural steel, aluminum, copper')
ON CONFLICT (id) DO NOTHING;

