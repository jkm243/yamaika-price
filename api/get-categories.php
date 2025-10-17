<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    $pdo = getDBConnection();
    
    $stmt = $pdo->query("
        SELECT c.*, COUNT(p.id) as product_count 
        FROM categories c 
        LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1 
        GROUP BY c.id 
        ORDER BY c.name_ru
    ");
    
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    jsonResponse([
        'success' => true,
        'categories' => $categories
    ]);
    
} catch (Exception $e) {
    jsonResponse([
        'success' => false,
        'error' => 'Failed to fetch categories: ' . $e->getMessage()
    ], 500);
}
?>