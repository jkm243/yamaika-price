<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['product_id'])) {
    jsonResponse(['error' => 'Missing product_id'], 400);
}

try {
    $pdo = getDBConnection();
    
    $productId = (int)$input['product_id'];
    
    // Vérifier si le produit existe
    $checkStmt = $pdo->prepare("SELECT id FROM products WHERE id = ?");
    $checkStmt->execute([$productId]);
    
    if (!$checkStmt->fetch()) {
        jsonResponse(['error' => 'Product not found'], 404);
    }
    
    // Commencer une transaction
    $pdo->beginTransaction();
    
    // Supprimer les prix associés
    $deletePricesStmt = $pdo->prepare("DELETE FROM prices WHERE product_id = ?");
    $deletePricesStmt->execute([$productId]);
    
    // Supprimer les paramètres associés
    $deleteParamsStmt = $pdo->prepare("DELETE FROM product_parameters WHERE product_id = ?");
    $deleteParamsStmt->execute([$productId]);
    
    // Supprimer le produit
    $deleteProductStmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
    $deleteProductStmt->execute([$productId]);
    
    // Valider la transaction
    $pdo->commit();
    
    jsonResponse([
        'success' => true,
        'message' => 'Product deleted successfully'
    ]);
    
} catch (Exception $e) {
    // Annuler la transaction en cas d'erreur
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    jsonResponse([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ], 500);
}
?>