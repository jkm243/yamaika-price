-- Insertion des catégories principales
INSERT IGNORE INTO categories (id, name_ru, name_fr, description) VALUES
('tshirts', 'Футболки и одежда', 'T-shirts et vêtements', 'Футболки, толстовки, худи, поло и другая одежда'),
('printing', 'Печать и макеты', 'Impression et maquettes', 'Шелкография, вышивка, ДТФ печать, макеты'),
('sport', 'Спортивная форма', 'Forme sportive', 'Спортивная форма, номера, сублимация'),
('accessories', 'Аксессуары', 'Accessoires', 'Кружки, значки, брелоки, подушки'),
('flags', 'Флаги и вымпелы', 'Drapeaux et fanions', 'Флаги, вымпелы, баннеры'),
('bags', 'Пакеты и сумки', 'Sacs et emballages', 'Пакеты, шопперы, сумки'),
('stationery', 'Канцелярия', 'Papeterie', 'Блокноты, ручки, ежедневники'),
('promo', 'Промо продукция', 'Produits promotionnels', 'Промо-продукция, сувениры'),
('mugs', 'Кружки и посуда', 'Tasses et vaisselle', 'Кружки, термосы, посуда'),
('badges', 'Значки и брелоки', 'Badges et porte-clés', 'Значки, магниты, брелоки'),
('pillows', 'Подушки и текстиль', 'Oreillers et textile', 'Подушки, дакимакуры, текстиль'),
('printing_services', 'Услуги печати', 'Services d impression', 'Печать на различных материалах');