-- Coefficients d'impression (feuille "Макеты")
INSERT INTO products (category_id, name_ru, description_ru, notes) VALUES
('printing_services', 'ВМТ печать', 'Коэффициент для ВМТ печати', ''),
('printing_services', 'Флекс печать', 'Коэффициент для флекс печати', ''),
('printing_services', 'Водоотал/Стрейч/Неон печать', 'Коэффициент для специальных материалов', ''),
('printing_services', 'Блестки печать', 'Коэффициент для печати с блестками', ''),
('printing_services', 'ДТФ с переносом', 'Коэффициент для ДТФ печати', '');

-- Les coefficients sont stockés comme des paramètres
INSERT INTO product_parameters (product_id, parameter_name, parameter_value, parameter_type) VALUES
(19, '1шт', '1.5', 'coefficient'),
(19, '10шт', '1.2', 'coefficient'),
(19, '30/50шт', '1', 'coefficient'),
(19, '100шт', '0.8', 'coefficient'),

(20, '1шт', '1.2', 'coefficient'),
(20, '10шт', '1', 'coefficient'),
(20, '30/50шт', '0.8', 'coefficient'),
(20, '100шт', '0.7', 'coefficient'),

(21, '1шт', '1.6', 'coefficient'),
(21, '10шт', '1.5', 'coefficient'),
(21, '30/50шт', '1.2', 'coefficient'),
(21, '100шт', '1', 'coefficient'),

(22, '1шт', '1.6', 'coefficient'),
(22, '10шт', '1.5', 'coefficient'),
(22, '30/50шт', '1.2', 'coefficient'),
(22, '100шт', '1', 'coefficient'),

(23, '1шт', '0.9', 'coefficient'),
(23, '10шт', '0.8', 'coefficient'),
(23, '30/50шт', '0.6', 'coefficient'),
(23, '100шт', '0.5', 'coefficient');