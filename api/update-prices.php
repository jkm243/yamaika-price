<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

// Vérifier les données d'entrée
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['product_id']) || !isset($input['prices'])) {
    jsonResponse(['error' => 'Missing required fields'], 400);
}

try {
    $pdo = getDBConnection();
    
    $productId = (int)$input['product_id'];
    $prices = $input['prices'];
    
    // Vérifier si le produit existe
    $checkStmt = $pdo->prepare("SELECT id FROM products WHERE id = ?");
    $checkStmt->execute([$productId]);
    
    if (!$checkStmt->fetch()) {
        jsonResponse(['error' => 'Product not found'], 404);
    }
    
    // Préparer la requête de mise à jour
    $updateFields = [];
    $updateValues = [];
    
    $allowedFields = [
        'quantity_1', 'quantity_10', 'quantity_50', 'quantity_100',
        'quantity_200', 'quantity_300', 'quantity_400', 'quantity_500', 'quantity_1000',
        'unit', 'min_order', 'production_days'
    ];
    
    foreach ($allowedFields as $field) {
        if (isset($prices[$field])) {
            $updateFields[] = "{$field} = ?";
            $updateValues[] = $prices[$field];
        }
    }
    
    if (empty($updateFields)) {
        jsonResponse(['error' => 'No valid price fields to update'], 400);
    }
    
    // Vérifier si une entrée de prix existe déjà
    $checkPriceStmt = $pdo->prepare("SELECT id FROM prices WHERE product_id = ?");
    $checkPriceStmt->execute([$productId]);
    
    if ($checkPriceStmt->fetch()) {
        // Mise à jour
        $sql = "UPDATE prices SET " . implode(', ', $updateFields) . ", updated_at = NOW() WHERE product_id = ?";
        $updateValues[] = $productId;
    } else {
        // Insertion
        $updateFields[] = 'product_id';
        $updateValues[] = $productId;
        $sql = "INSERT INTO prices SET " . implode(', ', $updateFields) . ", created_at = NOW(), updated_at = NOW()";
    }
    
    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute($updateValues);
    
    if ($success) {
        jsonResponse([
            'success' => true,
            'message' => 'Prices updated successfully',
            'product_id' => $productId
        ]);
    } else {
        jsonResponse(['error' => 'Failed to update prices'], 500);
    }
    
} catch (Exception $e) {
    jsonResponse([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ], 500);
}
?>