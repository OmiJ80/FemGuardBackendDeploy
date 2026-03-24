-- PostgreSQL Schema for PCOS Fertility App

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    reset_token VARCHAR(255) DEFAULT NULL,
    reset_token_expiry TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assessments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    pcos_score INT NOT NULL,
    pcos_category VARCHAR(50) NOT NULL,
    pcos_ayurvedic TEXT NOT NULL,
    metabolic_score INT NOT NULL,
    metabolic_category VARCHAR(50) NOT NULL,
    metabolic_ayurvedic TEXT NOT NULL,
    infertility_score INT NOT NULL,
    infertility_category VARCHAR(50) NOT NULL,
    infertility_ayurvedic TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ovulation_cycles (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    last_period_date DATE NOT NULL,
    average_cycle_length INT NOT NULL,
    next_period_date DATE NOT NULL,
    ovulation_date DATE NOT NULL,
    fertile_window_start DATE NOT NULL,
    fertile_window_end DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    razorpay_order_id VARCHAR(255) NOT NULL,
    razorpay_payment_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
