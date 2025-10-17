-- Badges et magnets (feuille "Значки")
INSERT INTO products (category_id, name_ru, description_ru, notes) VALUES
('badges', 'Значки D-37мм', 'Круглый значок диаметром 37мм', ''),
('badges', 'Значки D-58мм', 'Круглый значок диаметром 58мм', ''),
('badges', 'Магнит закатной Круглый D-58мм', 'Круглый магнит 58мм', ''),
('badges', 'Магнит закатной Прямоугольный', 'Прямоугольный магнит', '');

INSERT INTO prices (product_id, quantity_1, quantity_10, quantity_50, quantity_100, quantity_300, quantity_500, quantity_1000) VALUES
(57, 100, 70, 45, 35, 33, 31, 30),
(58, 100, 80, 55, 45, 40, 35, 32),
(59, 150, 120, 90, 80, 70, 50, NULL),
(60, 200, 150, 120, 100, 90, 70, 65);

-- Drapeaux (feuille "ФЛАГИ")
INSERT INTO products (category_id, name_ru, description_ru, notes) VALUES
('flags', 'Флаг Полиэфирный шёлк 10x15', 'Флаг из полиэфирного шелка 10x15см', ''),
('flags', 'Флаг Полиэфирный шёлк 20x30', 'Флаг из полиэфирного шелка 20x30см', ''),
('flags', 'Флаг Полиэфирный шёлк 60x90', 'Флаг из полиэфирного шелка 60x90см', ''),
('flags', 'Флаг Габардин 10x15', 'Флаг из габардина 10x15см', ''),
('flags', 'Флаг Габардин 20x30', 'Флаг из габардина 20x30см', '');

INSERT INTO prices (product_id, quantity_1, quantity_10, quantity_50, quantity_100) VALUES
(61, 250, 190, 110, 100),
(62, 350, 210, 120, 110),
(63, 700, 600, 500, 450),
(64, 320, 190, 110, 100),
(65, 360, 210, 120, 110);

-- Sérigraphie (feuille "Шелкография")
INSERT INTO products (category_id, name_ru, description_ru, notes) VALUES
('printing_services', 'Шелкография 1 цвет 150x150', 'Печать одним цветом на площади 150x150мм', ''),
('printing_services', 'Шелкография 1 цвет 300x300', 'Печать одним цветом на площади 300x300мм', ''),
('printing_services', 'Шелкография 2 цвета 150x150', 'Печать двумя цветами на площади 150x150мм', ''),
('printing_services', 'Шелкография 2 цвета 300x300', 'Печать двумя цветами на площади 300x300мм', '');

INSERT INTO prices (product_id, quantity_10, quantity_20, quantity_30, quantity_50, quantity_100, quantity_200, quantity_300, quantity_400, quantity_500) VALUES
(66, 50, 39, 36, 26, 23, 20, 17, 16, 15),
(67, 70, 50, 45, 40, 33, 30, 26, 24, 21),
(68, 100, 63, 48, 38, 35, 30, 28, 26, 21),
(69, 120, 80, 60, 50, 47, 46, 39, 36, 32);

-- Broderie (feuille "Вышивка")
INSERT INTO products (category_id, name_ru, description_ru, notes) VALUES
('printing_services', 'Вышивка на кепках', 'Вышивка логотипа на кепках', ''),
('printing_services', 'Вышивка на футболках (малый принт)', 'Небольшой принт на груди', ''),
('printing_services', 'Вышивка на футболках (спина)', 'Принт на спине футболки', '');

INSERT INTO prices (product_id, quantity_1, quantity_5, quantity_10, quantity_30, quantity_50, quantity_100) VALUES
(70, 800, 500, 300, 250, 200, 175),
(71, 800, 500, 300, 250, 200, 150),
(72, 1750, 1500, 1200, 1000, 900, 800);

-- Sacs (feuille "Пакеты")
INSERT INTO products (category_id, name_ru, description_ru, notes) VALUES
('bags', 'Пакет бумажный 14x168 вертикальный', 'Бумажный пакет вертикальный 14x168см', ''),
('bags', 'Пакет бумажный 20x30x10 вертикальный', 'Бумажный пакет вертикальный 20x30x10см', ''),
('bags', 'Пакет ПВД 20x30см белый', 'Полиэтиленовый пакет 20x30см белый', ''),
('bags', 'Пакет ПВД 30x40см белый', 'Полиэтиленовый пакет 30x40см белый', '');

INSERT INTO prices (product_id, quantity_100, quantity_200, quantity_300, quantity_500) VALUES
(73, 196, 148, 126, 103),
(74, 255, 193, 166, 147),
(75, 44, 37, 30.5, 24.5),
(76, 54, 42, 34.8, 28.9);