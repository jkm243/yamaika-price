<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    $pdo = getDBConnection();
    
    // Récupérer les catégories
    $categoriesStmt = $pdo->query("SELECT * FROM categories ORDER BY name_ru");
    $categories = $categoriesStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Récupérer les produits avec leurs prix
    $productsStmt = $pdo->query("
        SELECT 
            p.*,
            pr.quantity_1, pr.quantity_10, pr.quantity_50, pr.quantity_100,
            pr.quantity_200, pr.quantity_300, pr.quantity_400, pr.quantity_500, pr.quantity_1000,
            pr.unit, pr.min_order, pr.production_days,
            c.name_ru as category_name
        FROM products p
        LEFT JOIN prices pr ON p.id = pr.product_id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = 1
        ORDER BY c.name_ru, p.name_ru
    ");
    
    $products = $productsStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Structurer les données
    $formattedProducts = array_map(function($product) {
        return [
            'id' => (int)$product['id'],
            'category_id' => $product['category_id'],
            'category_name' => $product['category_name'],
            'name_ru' => $product['name_ru'],
            'description_ru' => $product['description_ru'],
            'specifications' => $product['specifications'],
            'notes' => $product['notes'],
            'is_active' => (bool)$product['is_active'],
            'prices' => [
                'quantity_1' => $product['quantity_1'] ? (float)$product['quantity_1'] : null,
                'quantity_10' => $product['quantity_10'] ? (float)$product['quantity_10'] : null,
                'quantity_50' => $product['quantity_50'] ? (float)$product['quantity_50'] : null,
                'quantity_100' => $product['quantity_100'] ? (float)$product['quantity_100'] : null,
                'quantity_200' => $product['quantity_200'] ? (float)$product['quantity_200'] : null,
                'quantity_300' => $product['quantity_300'] ? (float)$product['quantity_300'] : null,
                'quantity_400' => $product['quantity_400'] ? (float)$product['quantity_400'] : null,
                'quantity_500' => $product['quantity_500'] ? (float)$product['quantity_500'] : null,
                'quantity_1000' => $product['quantity_1000'] ? (float)$product['quantity_1000'] : null,
                'unit' => $product['unit'] ?: 'р',
                'min_order' => $product['min_order'] ? (float)$product['min_order'] : null,
                'production_days' => $product['production_days'] ? (int)$product['production_days'] : null
            ]
        ];
    }, $products);
    
    jsonResponse([
        'success' => true,
        'categories' => $categories,
        'products' => $formattedProducts,
        'total_products' => count($formattedProducts)
    ]);
    
} catch (Exception $e) {
    jsonResponse([
        'success' => false,
        'error' => 'Failed to fetch products: ' . $e->getMessage()
    ], 500);
}
?>