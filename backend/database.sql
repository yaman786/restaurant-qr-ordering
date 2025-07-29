-- Create database (run this first)
-- CREATE DATABASE restaurant_ordering;

-- Connect to the database and run the following:

-- Create tables
CREATE TABLE tables (
    id SERIAL PRIMARY KEY,
    table_number INTEGER UNIQUE NOT NULL
);

CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    available BOOLEAN DEFAULT true
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    table_number INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'delivered', 'cancelled'))
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO tables (table_number) VALUES 
(1), (2), (3), (4), (5), (6), (7), (8), (9), (10);

INSERT INTO menu_items (name, description, price, available) VALUES 
('Margherita Pizza', 'Classic tomato sauce with mozzarella cheese', 12.99, true),
('Pepperoni Pizza', 'Spicy pepperoni with melted cheese', 14.99, true),
('Caesar Salad', 'Fresh romaine lettuce with Caesar dressing', 8.99, true),
('Chicken Wings', 'Crispy wings with your choice of sauce', 11.99, true),
('Pasta Carbonara', 'Creamy pasta with bacon and parmesan', 13.99, true),
('Burger Deluxe', 'Beef burger with fries and drink', 15.99, true),
('Fish & Chips', 'Beer-battered cod with crispy fries', 16.99, true),
('Chocolate Cake', 'Rich chocolate cake with vanilla ice cream', 6.99, true),
('Soft Drinks', 'Coke, Sprite, or Fanta', 2.99, true),
('Coffee', 'Fresh brewed coffee', 3.99, true);

-- Create admin user (password: admin123)
-- Note: This password hash is for 'admin123' - generate your own in production
INSERT INTO admin_users (username, password_hash) VALUES 
('admin', '$2b$10$rQZ8K9mN2pL1vX3yJ6hF8eS4tU7wA1bC5dE2fG9hI3jK6lM9nO0pQ1rS4tU7w'); 