<?php
require_once '../api/config.php';

// Ce script importe les données depuis le fichier JSON initial
function importInitialData() {
    try {
        $pdo = getDBConnection();
        
        // Lire le fichier de données initiales
        $jsonData = file_get_contents('../data/initial-data.json');
        $data = json_decode($jsonData, true);
        
        if (!$data) {
            throw new Exception('Invalid JSON data');
        }
        
        // Importer les catégories
        if (isset($data['categories'])) {
            $categoryStmt = $pdo->prepare("
                INSERT IGNORE INTO categories (id, name_ru, name_fr, description) 
                VALUES (?, ?, ?, ?)
            ");
            
            foreach ($data['categories'] as $category) {
                $categoryStmt->execute([
                    $category['id'],
                    $category['name_ru'],
                    $category['name_fr'] ?? null,
                    $category['description'] ?? null
                ]);
            }
            echo "Imported " . count($data['categories']) . " categories\n";
        }
        
        // Importer les produits
        if (isset($data['products'])) {
            $productStmt = $pdo->prepare("
                INSERT INTO products (category_id, name_ru, description_ru, notes, is_active) 
                VALUES (?, ?, ?, ?, 1)
            ");
            
            $priceStmt = $pdo->prepare("
                INSERT INTO prices (product_id, quantity_1, quantity_10, quantity_50, quantity_100, 
                                  quantity_200, quantity_300, quantity_400, quantity_500, quantity_1000,
                                  unit, min_order, production_days) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            foreach ($data['products'] as $product) {
                $productStmt->execute([
                    $product['category_id'],
                    $product['name_ru'],
                    $product['description_ru'] ?? null,
                    $product['notes'] ?? null
                ]);
                
                $productId = $pdo->lastInsertId();
                
                if (isset($product['prices'])) {
                    $prices = $product['prices'];
                    $priceStmt->execute([
                        $productId,
                        $prices['quantity_1'] ?? null,
                        $prices['quantity_10'] ?? null,
                        $prices['quantity_50'] ?? null,
                        $prices['quantity_100'] ?? null,
                        $prices['quantity_200'] ?? null,
                        $prices['quantity_300'] ?? null,
                        $prices['quantity_400'] ?? null,
                        $prices['quantity_500'] ?? null,
                        $prices['quantity_1000'] ?? null,
                        $prices['unit'] ?? 'р',
                        $prices['min_order'] ?? null,
                        $prices['production_days'] ?? null
                    ]);
                }
            }
            echo "Imported " . count($data['products']) . " products\n";
        }
        
        echo "Data import completed successfully!\n";
        
    } catch (Exception $e) {
        echo "Error importing data: " . $e->getMessage() . "\n";
    }
}

importInitialData();
?>