DROP TABLE IF EXISTS orders_products;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- CREATE TABLES
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    note TEXT,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL
);

CREATE TABLE orders_products (
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    PRIMARY KEY (order_id, product_id)
);


-- SEED DATA

-- Users
INSERT INTO users (username, password)
VALUES ('leon_kennedy', 'password123');

-- Products (From Resident Evil 4 Store)
INSERT INTO products (title, description, price) VALUES
('Handgun Ammo', 'Box of 9mm rounds used by standard handguns. Essential for survival.', 1.99),
('First Aid Spray', 'Powerful medical spray that completely restores health.', 9.99),
('Green Herb', 'A medicinal herb that restores a small amount of health.', 4.99),
('Red Herb', 'Can be mixed with a green herb to boost its potency.', 5.99),
('Shotgun Shells', 'Ammunition for shotguns. Devastating at close range.', 3.49),
('TMP', 'Fully automatic submachine gun favored by pros. “You’ll need more cash, stranger!”', 29900.00),
('Rifle', 'High-powered bolt-action rifle ideal for long-range enemies.', 35000.00),
('Rocket Launcher (One-Time Use)', 'Massive damage weapon that can take down almost any enemy.', 300000.00),
('Attaché Case L', 'A large carrying case that increases inventory space.', 98000.00),
('Treasure Map (Village)', 'Reveals hidden treasures in the village area.', 10000.00);

-- Orders
INSERT INTO orders (date, note, user_id)
VALUES (CURRENT_DATE, 'Merchant special deal order', 1);

-- Orders_Products (Leon's order with at least 5 items)
INSERT INTO orders_products (order_id, product_id, quantity) VALUES
(1, 1, 3),  -- Handgun Ammo
(1, 2, 1),  -- First Aid Spray
(1, 3, 2),  -- Green Herb
(1, 5, 1),  -- Shotgun Shells
(1, 6, 1),  -- TMP
(1, 10, 1); -- Treasure Map
