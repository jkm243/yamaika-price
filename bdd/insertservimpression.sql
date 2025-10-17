-- Coûts d'impression par article
INSERT INTO products (category_id, name_ru, description_ru, notes) VALUES
('printing_services', 'Печать на футболке / поло', 'Стоимость печати на футболках', ''),
('printing_services', 'Печать на кепке / шапке', 'Стоимость печати на головных уборах', ''),
('printing_services', 'Печать на свитшоте / худи / толстовке', 'Стоимость печати на теплой одежде', ''),
('printing_services', 'Печать на куртке летней / ветровке', 'Стоимость печати на верхней одежде', ''),
('printing_services', 'Печать на куртке зимней', 'Стоимость печати на зимней одежде', '');

INSERT INTO prices (product_id, quantity_1, quantity_10, quantity_50, quantity_100, quantity_200, quantity_500) VALUES
(24, 50, 50, 50, 20, 20, 20),
(25, 100, 100, 80, 50, 50, 30),
(26, 50, 50, 50, 30, 30, 30),
(27, 80, 80, 80, 60, 60, 60),
(28, 150, 150, 150, 120, 100, 100);