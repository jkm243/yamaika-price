-- Catégories principales
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_ru VARCHAR(255) NOT NULL,
    name_fr VARCHAR(255),
    description TEXT,
    parent_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Produits et services
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    name_ru VARCHAR(500) NOT NULL,
    description_ru TEXT,
    specifications TEXT,
    notes TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Table des prix avec différentes quantités
CREATE TABLE prices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    quantity_1 DECIMAL(10,2),
    quantity_10 DECIMAL(10,2),
    quantity_50 DECIMAL(10,2),
    quantity_100 DECIMAL(10,2),
    quantity_200 DECIMAL(10,2),
    quantity_300 DECIMAL(10,2),
    quantity_400 DECIMAL(10,2),
    quantity_500 DECIMAL(10,2),
    quantity_1000 DECIMAL(10,2),
    unit VARCHAR(50) DEFAULT 'р',
    min_order DECIMAL(10,2),
    production_days INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Table pour coefficients et paramètres spéciaux
CREATE TABLE product_parameters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    parameter_name VARCHAR(255),
    parameter_value VARCHAR(500),
    parameter_type ENUM('coefficient', 'additional_cost', 'note', 'specification'),
    FOREIGN KEY (product_id) REFERENCES products(id)
);