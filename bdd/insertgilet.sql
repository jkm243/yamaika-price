-- Gilets
INSERT INTO products (category_id, name_ru, description_ru, notes) VALUES
('tshirts', 'Жилеты Осенние (один синтепон с подкладой)', 'Осенний жилет с синтепоном', ''),
('tshirts', 'Жилеты Зимние (два синтепона по 300гр)', 'Зимний утепленный жилет', ''),
('tshirts', 'Жилеты Промо без подклады', 'Промо жилет без подкладки', ''),
('tshirts', 'Жилеты Флисовые 260-300гр', 'Флисовый жилет', '');

INSERT INTO prices (product_id, quantity_1, quantity_10, quantity_50, quantity_100) VALUES
(15, 2700, NULL, NULL, NULL),
(16, 3000, NULL, NULL, NULL),
(17, 1300, 1100, 950, NULL),
(18, 1200, 1100, 1000, NULL);