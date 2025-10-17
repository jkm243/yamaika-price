// Données des produits (seront chargées depuis l'API)
let productsData = [];
let categoriesData = [];

// Chargement des données
async function loadData() {
    try {
        const response = await fetch('/api/get-products.php');
        const data = await response.json();
        
        productsData = data.products;
        categoriesData = data.categories;
        
        renderCategories();
        renderAllProducts();
        setupSearch();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Rendu des catégories
function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    
    const categories = [
        {
            id: 'tshirts',
            name: 'Футболки и одежда',
            icon: 'tshirt',
            description: 'Футболки, толстовки, худи, поло'
        },
        {
            id: 'printing',
            name: 'Печать и макеты',
            icon: 'print',
            description: 'Шелкография, вышивка, ДТФ печать'
        },
        {
            id: 'sport',
            name: 'Спортивная форма',
            icon: 'running',
            description: 'Форма, номера, сублимация'
        },
        {
            id: 'accessories',
            name: 'Аксессуары',
            icon: 'gift',
            description: 'Кружки, значки, брелоки'
        },
        {
            id: 'flags',
            name: 'Флаги и вымпелы',
            icon: 'flag',
            description: 'Флаги, вымпелы, баннеры'
        },
        {
            id: 'bags',
            name: 'Пакеты и сумки',
            icon: 'shopping-bag',
            description: 'Пакеты, шопперы, сумки'
        }
    ];

    grid.innerHTML = categories.map(cat => `
        <div class="category-card" onclick="showCategory('${cat.id}')">
            <div class="category-icon">
                <i class="fas fa-${cat.icon}"></i>
            </div>
            <h3>${cat.name}</h3>
            <p>${cat.description}</p>
        </div>
    `).join('');
}

// Rendu de tous les produits
function renderAllProducts() {
    const container = document.getElementById('productsContainer');
    
    // Grouper les produits par catégorie
    const productsByCategory = groupProductsByCategory(productsData);
    
    container.innerHTML = Object.keys(productsByCategory).map(categoryId => `
        <div class="products-table" id="${categoryId}">
            <div class="table-header">
                <h2>${getCategoryName(categoryId)}</h2>
            </div>
            <div class="table-container">
                ${renderProductsTable(productsByCategory[categoryId])}
            </div>
        </div>
    `).join('');
}

// Grouper les produits par catégorie
function groupProductsByCategory(products) {
    return products.reduce((acc, product) => {
        const category = product.category_id;
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {});
}

// Rendu du tableau des produits
function renderProductsTable(products) {
    if (products.length === 0) return '<p class="no-data">Нет данных</p>';
    
    // Déterminer les colonnes de quantité disponibles
    const quantityColumns = getAvailableQuantityColumns(products);
    
    return `
        <table>
            <thead>
                <tr>
                    <th>Наименование</th>
                    ${quantityColumns.map(qty => `<th>${qty}шт</th>`).join('')}
                    <th>Примечания</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => `
                    <tr>
                        <td>
                            <strong>${product.name_ru}</strong>
                            ${product.description_ru ? `<br><small>${product.description_ru}</small>` : ''}
                        </td>
                        ${quantityColumns.map(qty => `
                            <td class="price-cell">
                                ${product.prices[`quantity_${qty}`] ? `${product.prices[`quantity_${qty}`]}${product.prices.unit}` : '-'}
                            </td>
                        `).join('')}
                        <td class="notes-cell">
                            ${product.notes || ''}
                            ${product.prices.min_order ? `<br>Мин. заказ: ${product.prices.min_order}${product.prices.unit}` : ''}
                            ${product.prices.production_days ? `<br>Срок: ${product.prices.production_days} дн.` : ''}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Obtenir les colonnes de quantité disponibles
function getAvailableQuantityColumns(products) {
    const allColumns = ['1', '10', '50', '100', '200', '300', '400', '500', '1000'];
    return allColumns.filter(qty => 
        products.some(product => product.prices[`quantity_${qty}`])
    );
}

// Obtenir le nom de la catégorie
function getCategoryName(categoryId) {
    const categoryMap = {
        'tshirts': 'Футболки и одежда',
        'printing': 'Печать и макеты',
        'sport': 'Спортивная форма',
        'accessories': 'Аксессуары',
        'flags': 'Флаги и вымпелы',
        'bags': 'Пакеты и сумки'
    };
    return categoryMap[categoryId] || categoryId;
}

// Afficher une catégorie spécifique
function showCategory(categoryId) {
    const element = document.getElementById(categoryId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Configuration de la recherche
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length < 2) {
            renderAllProducts();
            return;
        }
        
        const filteredProducts = productsData.filter(product =>
            product.name_ru.toLowerCase().includes(searchTerm) ||
            (product.description_ru && product.description_ru.toLowerCase().includes(searchTerm)) ||
            (product.notes && product.notes.toLowerCase().includes(searchTerm))
        );
        
        renderSearchResults(filteredProducts, searchTerm);
    });
}

// Rendu des résultats de recherche
function renderSearchResults(products, searchTerm) {
    const container = document.getElementById('productsContainer');
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Ничего не найдено</h3>
                <p>Попробуйте изменить поисковый запрос</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="search-results-header">
            <h2>Результаты поиска: "${searchTerm}"</h2>
            <p>Найдено: ${products.length} товаров</p>
        </div>
        <div class="products-table">
            <div class="table-container">
                ${renderProductsTable(products)}
            </div>
        </div>
    `;
}

// Initialisation
document.addEventListener('DOMContentLoaded', loadData);