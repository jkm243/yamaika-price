<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['id']) || !isset($input['name_ru'])) {
    jsonResponse(['error' => 'Missing required fields'], 400);
}

try {
    $pdo = getDBConnection();
    
    $productId = (int)$input['id'];
    
    // Vérifier si le produit existe
    $checkStmt = $pdo->prepare("SELECT id FROM products WHERE id = ?");
    $checkStmt->execute([$productId]);
    
    if (!$checkStmt->fetch()) {
        jsonResponse(['error' => 'Product not found'], 404);
    }
    
    // Préparer la mise à jour
    $updateFields = [];
    $updateValues = [];
    
    $allowedFields = [
        'name_ru', 'description_ru', 'specifications', 'notes', 
        'category_id', 'is_active'
    ];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $updateFields[] = "{$field} = ?";
            $updateValues[] = $input[$field];
        }
    }
    
    if (empty($updateFields)) {
        jsonResponse(['error' => 'No valid fields to update'], 400);
    }
    
    $sql = "UPDATE products SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $updateValues[] = $productId;
    
    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute($updateValues);
    
    if ($success) {
        jsonResponse([
            'success' => true,
            'message' => 'Product updated successfully',
            'product_id' => $productId
        ]);
    } else {
        jsonResponse(['error' => 'Failed to update product'], 500);
    }
    
} catch (Exception $e) {
    jsonResponse([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ], 500);
}
?>