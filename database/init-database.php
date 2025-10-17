<?php
require_once '../api/config.php';

try {
    $pdo = getDBConnection();
    
    // Créer les tables si elles n'existent pas
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS categories (
            id VARCHAR(50) PRIMARY KEY,
            name_ru VARCHAR(255) NOT NULL,
            name_fr VARCHAR(255),
            description TEXT,
            parent_id VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (parent_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        
        CREATE TABLE IF NOT EXISTS products (
            id INT PRIMARY KEY AUTO_INCREMENT,
            category_id VARCHAR(50) NOT NULL,
            name_ru VARCHAR(500) NOT NULL,
            description_ru TEXT,
            specifications TEXT,
            notes TEXT,
            image_url VARCHAR(500),
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (category_id),
            INDEX (is_active),
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        
        CREATE TABLE IF NOT EXISTS prices (
            id INT PRIMARY KEY AUTO_INCREMENT,
            product_id INT NOT NULL,
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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX (product_id),
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        
        CREATE TABLE IF NOT EXISTS product_parameters (
            id INT PRIMARY KEY AUTO_INCREMENT,
            product_id INT NOT NULL,
            parameter_name VARCHAR(255) NOT NULL,
            parameter_value VARCHAR(500),
            parameter_type ENUM('coefficient', 'additional_cost', 'note', 'specification'),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (product_id),
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    
    // Insérer les catégories de base
    $categories = [
        ['tshirts', 'Футболки и одежда', 'T-shirts et vêtements', 'Футболки, толстовки, худи, поло и другая одежда', null],
        ['printing', 'Печать и макеты', 'Impression et maquettes', 'Шелкография, вышивка, ДТФ печать, макеты', null],
        ['sport', 'Спортивная форма', 'Forme sportive', 'Спортивная форма, номера, сублимация', null],
        ['accessories', 'Аксессуары', 'Accessoires', 'Кружки, значки, брелоки, подушки', null],
        ['flags', 'Флаги и вымпелы', 'Drapeaux et fanions', 'Флаги, вымпелы, баннеры', null],
        ['bags', 'Пакеты и сумки', 'Sacs et emballages', 'Пакеты, шопперы, сумки', null],
        ['stationery', 'Канцелярия', 'Papeterie', 'Блокноты, ручки, ежедневники', null],
        ['promo', 'Промо продукция', 'Produits promotionnels', 'Промо-продукция, сувениры', null]
    ];
    
    $categoryStmt = $pdo->prepare("
        INSERT IGNORE INTO categories (id, name_ru, name_fr, description, parent_id) 
        VALUES (?, ?, ?, ?, ?)
    ");
    
    foreach ($categories as $category) {
        $categoryStmt->execute($category);
    }
    
    echo "Database initialized successfully!";
    
} catch (Exception $e) {
    echo "Error initializing database: " . $e->getMessage();
}
?>