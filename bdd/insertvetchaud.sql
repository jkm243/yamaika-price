-- Vêtements chauds (Sweats, Hoodies)
INSERT INTO products (category_id, name_ru, description_ru, notes) VALUES
('tshirts', 'Свитшот', 'Теплый свитшот', ''),
('tshirts', 'Толстовка', 'Толстовка с капюшоном', ''),
('tshirts', 'Худи', 'Худи с карманом-кенгуру', ''),
('tshirts', '+ молния', 'Доплата за молнию', '');

INSERT INTO prices (product_id, quantity_1, quantity_10, quantity_50, quantity_100, quantity_200, quantity_300) VALUES
(10, 2000, 1850, 1400, 1400, 1400, 1280),
(11, 2200, 1950, 1550, 1550, 1550, 1450),
(12, 2500, 2050, 1600, 1600, 1600, 1500),
(13, 200, 150, 120, 100, 80, 70);