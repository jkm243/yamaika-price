<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['name_ru']) || !isset($input['category_id'])) {
    jsonResponse(['error' => 'Missing required fields: name_ru and category_id'], 400);
}

try {
    $pdo = getDBConnection();
    
    // Vérifier que la catégorie existe
    $checkCategoryStmt = $pdo->prepare("SELECT id FROM categories WHERE id = ?");
    $checkCategoryStmt->execute([$input['category_id']]);
    
    if (!$checkCategoryStmt->fetch()) {
        jsonResponse(['error' => 'Category not found'], 404);
    }
    
    // Insérer le nouveau produit
    $sql = "INSERT INTO products (name_ru, description_ru, specifications, notes, category_id, is_active, created_at) 
            VALUES (?, ?, ?, ?, ?, 1, NOW())";
    
    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute([
        $input['name_ru'],
        $input['description_ru'] ?? null,
        $input['specifications'] ?? null,
        $input['notes'] ?? null,
        $input['category_id']
    ]);
    
    if ($success) {
        $newProductId = $pdo->lastInsertId();
        
        // Si des prix sont fournis, les insérer aussi
        if (isset($input['prices']) && is_array($input['prices'])) {
            $priceFields = [];
            $priceValues = [];
            $pricePlaceholders = [];
            
            $allowedPriceFields = [
                'quantity_1', 'quantity_10', 'quantity_50', 'quantity_100',
                'quantity_200', 'quantity_300', 'quantity_400', 'quantity_500', 'quantity_1000',
                'unit', 'min_order', 'production_days'
            ];
            
            foreach ($allowedPriceFields as $field) {
                if (isset($input['prices'][$field])) {
                    $priceFields[] = $field;
                    $priceValues[] = $input['prices'][$field];
                    $pricePlaceholders[] = '?';
                }
            }
            
            if (!empty($priceFields)) {
                $priceFields[] = 'product_id';
                $priceValues[] = $newProductId;
                $pricePlaceholders[] = '?';
                
                $priceSql = "INSERT INTO prices (" . implode(', ', $priceFields) . ", created_at, updated_at) 
                            VALUES (" . implode(', ', $pricePlaceholders) . ", NOW(), NOW())";
                
                $priceStmt = $pdo->prepare($priceSql);
                $priceStmt->execute($priceValues);
            }
        }
        
        jsonResponse([
            'success' => true,
            'message' => 'Product added successfully',
            'product_id' => $newProductId
        ]);
    } else {
        jsonResponse(['error' => 'Failed to add product'], 500);
    }
    
} catch (Exception $e) {
    jsonResponse([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ], 500);
}
?>