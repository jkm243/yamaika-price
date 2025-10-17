// Gestion du dashboard administrateur
class AdminManager {
    constructor() {
        this.products = [];
        this.categories = [];
        this.unsavedChanges = new Set();
        this.currentEditProductId = null;
        this.init();
    }

    async init() {
        await this.loadData();
        this.renderProductsTable();
        this.setupEventListeners();
        this.setupAutoSave();
        this.populateCategoryOptions();
    }

    async loadData() {
        try {
            this.showLoading(true);
            const response = await fetch('../api/get-products.php');
            const data = await response.json();
            
            if (data.success) {
                this.products = data.products;
                this.categories = data.categories;
                this.populateCategoryFilter();
                this.showSuccess('Данные успешно загружены');
            } else {
                this.showError('Ошибка загрузки данных: ' + data.error);
            }
        } catch (error) {
            this.showError('Ошибка сети: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    showLoading(show) {
        const loader = document.getElementById('loadingIndicator') || this.createLoader();
        loader.style.display = show ? 'block' : 'none';
    }

    createLoader() {
        const loader = document.createElement('div');
        loader.id = 'loadingIndicator';
        loader.innerHTML = `
            <div class="loader-overlay">
                <div class="loader-spinner"></div>
                <p>Загрузка данных...</p>
            </div>
        `;
        document.body.appendChild(loader);
        return loader;
    }

    populateCategoryFilter() {
        const filter = document.getElementById('categoryFilter');
        if (!filter) return;
        
        filter.innerHTML = '<option value="">Все категории</option>';
        
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = `${category.name_ru} (${this.getProductCount(category.id)})`;
            filter.appendChild(option);
        });
    }

    populateCategoryOptions() {
        const select = document.getElementById('productCategory');
        if (!select) return;
        
        select.innerHTML = '<option value="">Выберите категорию</option>';
        
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name_ru;
            select.appendChild(option);
        });
    }

    getProductCount(categoryId) {
        return this.products.filter(p => p.category_id === categoryId).length;
    }

    renderProductsTable(filteredProducts = null) {
        const tbody = document.getElementById('adminProductsTable');
        if (!tbody) return;
        
        const productsToRender = filteredProducts || this.products;
        
        if (productsToRender.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="no-data">
                        <i class="fas fa-box-open"></i>
                        <p>Нет товаров для отображения</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = productsToRender.map(product => this.renderProductRow(product)).join('');
    }

    renderProductRow(product) {
        const prices = product.prices || {};
        const hasUnsavedChanges = this.unsavedChanges.has(product.id);
        
        return `
            <tr data-product-id="${product.id}" class="${hasUnsavedChanges ? 'unsaved-row' : ''}">
                <td>
                    <div class="product-name">
                        <strong>${this.escapeHtml(product.name_ru)}</strong>
                        ${product.description_ru ? `<br><small>${this.escapeHtml(product.description_ru)}</small>` : ''}
                    </div>
                </td>
                <td>${this.escapeHtml(product.category_name)}</td>
                <td>
                    <input type="number" 
                           class="price-input" 
                           data-field="quantity_1" 
                           value="${prices.quantity_1 || ''}" 
                           step="0.01"
                           min="0"
                           onchange="adminManager.onPriceChange(${product.id}, 'quantity_1', this.value)">
                </td>
                <td>
                    <input type="number" 
                           class="price-input" 
                           data-field="quantity_10" 
                           value="${prices.quantity_10 || ''}" 
                           step="0.01"
                           min="0"
                           onchange="adminManager.onPriceChange(${product.id}, 'quantity_10', this.value)">
                </td>
                <td>
                    <input type="number" 
                           class="price-input" 
                           data-field="quantity_50" 
                           value="${prices.quantity_50 || ''}" 
                           step="0.01"
                           min="0"
                           onchange="adminManager.onPriceChange(${product.id}, 'quantity_50', this.value)">
                </td>
                <td>
                    <input type="number" 
                           class="price-input" 
                           data-field="quantity_100" 
                           value="${prices.quantity_100 || ''}" 
                           step="0.01"
                           min="0"
                           onchange="adminManager.onPriceChange(${product.id}, 'quantity_100', this.value)">
                </td>
                <td>
                    <input type="number" 
                           class="price-input" 
                           data-field="quantity_200" 
                           value="${prices.quantity_200 || ''}" 
                           step="0.01"
                           min="0"
                           onchange="adminManager.onPriceChange(${product.id}, 'quantity_200', this.value)">
                </td>
                <td>
                    <input type="number" 
                           class="price-input" 
                           data-field="quantity_300" 
                           value="${prices.quantity_300 || ''}" 
                           step="0.01"
                           min="0"
                           onchange="adminManager.onPriceChange(${product.id}, 'quantity_300', this.value)">
                </td>
                <td class="actions-cell">
                    <button class="action-btn edit-btn" onclick="adminManager.editProduct(${product.id})" title="Редактировать">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="adminManager.deleteProduct(${product.id})" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                    ${hasUnsavedChanges ? '<span class="unsaved-badge" title="Несохраненные изменения">●</span>' : ''}
                </td>
            </tr>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    onPriceChange(productId, field, value) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Validation
        const numValue = value === '' ? null : parseFloat(value);
        if (numValue !== null && (isNaN(numValue) || numValue < 0)) {
            this.showError('Введите корректное положительное число');
            return;
        }

        // Marquer comme modifié
        this.unsavedChanges.add(productId);
        
        // Mettre à jour localement
        if (!product.prices) product.prices = {};
        product.prices[field] = numValue;
        
        // Mettre à jour l'affichage
        this.updateRowIndicator(productId);
    }

    updateRowIndicator(productId) {
        const row = document.querySelector(`tr[data-product-id="${productId}"]`);
        if (!row) return;

        row.classList.add('unsaved-row');
        
        let indicator = row.querySelector('.unsaved-badge');
        if (!indicator) {
            indicator = document.createElement('span');
            indicator.className = 'unsaved-badge';
            indicator.textContent = '●';
            indicator.title = 'Несохраненные изменения';
            row.querySelector('.actions-cell').appendChild(indicator);
        }
    }

    async saveAllChanges() {
        const changes = Array.from(this.unsavedChanges);
        if (changes.length === 0) {
            this.showInfo('Нет изменений для сохранения');
            return;
        }

        this.showLoading(true);
        let successCount = 0;
        
        for (const productId of changes) {
            const success = await this.saveProductChanges(productId);
            if (success) {
                successCount++;
                this.unsavedChanges.delete(productId);
            }
        }
        
        this.showLoading(false);
        
        if (successCount === changes.length) {
            this.showSuccess(`Все изменения сохранены успешно! (${successCount} товаров)`);
            this.clearAllIndicators();
        } else {
            this.showError(`Сохранено ${successCount} из ${changes.length} товаров. Проверьте ошибки.`);
        }
    }

    async saveProductChanges(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product || !product.prices) return false;

        try {
            const response = await fetch('../api/update-prices.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: productId,
                    prices: product.prices
                })
            });

            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('Error saving product:', error);
            return false;
        }
    }

    clearAllIndicators() {
        document.querySelectorAll('.unsaved-row').forEach(row => {
            row.classList.remove('unsaved-row');
        });
        document.querySelectorAll('.unsaved-badge').forEach(indicator => {
            indicator.remove();
        });
    }

    filterByCategory() {
        const filter = document.getElementById('categoryFilter');
        const selectedCategory = filter.value;
        
        if (!selectedCategory) {
            this.renderProductsTable();
            return;
        }
        
        const filteredProducts = this.products.filter(product => 
            product.category_id === selectedCategory
        );
        
        this.renderProductsTable(filteredProducts);
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        this.openEditModal(product);
    }

    openEditModal(product) {
        document.getElementById('modalTitle').textContent = 'Редактировать товар';
        document.getElementById('productName').value = product.name_ru;
        document.getElementById('productDescription').value = product.description_ru || '';
        document.getElementById('productNotes').value = product.notes || '';
        document.getElementById('productCategory').value = product.category_id;
        
        // Remplir les prix
        const prices = product.prices || {};
        document.getElementById('price1').value = prices.quantity_1 || '';
        document.getElementById('price10').value = prices.quantity_10 || '';
        document.getElementById('price50').value = prices.quantity_50 || '';
        document.getElementById('price100').value = prices.quantity_100 || '';
        document.getElementById('price200').value = prices.quantity_200 || '';
        document.getElementById('price300').value = prices.quantity_300 || '';
        document.getElementById('price400').value = prices.quantity_400 || '';
        document.getElementById('price500').value = prices.quantity_500 || '';
        document.getElementById('price1000').value = prices.quantity_1000 || '';
        document.getElementById('minOrder').value = prices.min_order || '';
        document.getElementById('productionDays').value = prices.production_days || '';
        document.getElementById('priceUnit').value = prices.unit || 'р';
        
        this.currentEditProductId = product.id;
        this.openModal();
    }

    openModal() {
        document.getElementById('productModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('productModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.currentEditProductId = null;
    }

    async saveProduct() {
        const formData = this.getFormData();
        
        if (!this.validateForm(formData)) {
            return;
        }

        try {
            let response, result;
            
            if (this.currentEditProductId) {
                // Mise à jour
                formData.id = this.currentEditProductId;
                response = await fetch('../api/update-product.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                result = await response.json();
                
                if (result.success) {
                    // Mettre à jour les prix séparément
                    await this.updateProductPrices(this.currentEditProductId, formData.prices);
                }
            } else {
                // Nouveau produit
                response = await fetch('../api/add-product.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                result = await response.json();
            }

            if (result.success) {
                this.showSuccess('Товар успешно сохранен!');
                this.closeModal();
                await this.loadData();
                this.renderProductsTable();
            } else {
                this.showError('Ошибка сохранения товара: ' + result.error);
            }
        } catch (error) {
            this.showError('Ошибка сети: ' + error.message);
        }
    }

    getFormData() {
        return {
            name_ru: document.getElementById('productName').value.trim(),
            description_ru: document.getElementById('productDescription').value.trim(),
            notes: document.getElementById('productNotes').value.trim(),
            category_id: document.getElementById('productCategory').value,
            prices: {
                quantity_1: document.getElementById('price1').value || null,
                quantity_10: document.getElementById('price10').value || null,
                quantity_50: document.getElementById('price50').value || null,
                quantity_100: document.getElementById('price100').value || null,
                quantity_200: document.getElementById('price200').value || null,
                quantity_300: document.getElementById('price300').value || null,
                quantity_400: document.getElementById('price400').value || null,
                quantity_500: document.getElementById('price500').value || null,
                quantity_1000: document.getElementById('price1000').value || null,
                min_order: document.getElementById('minOrder').value || null,
                production_days: document.getElementById('productionDays').value || null,
                unit: document.getElementById('priceUnit').value || 'р'
            }
        };
    }

    validateForm(formData) {
        if (!formData.name_ru) {
            this.showError('Введите название товара');
            return false;
        }
        
        if (!formData.category_id) {
            this.showError('Выберите категорию');
            return false;
        }
        
        return true;
    }

    async updateProductPrices(productId, prices) {
        try {
            await fetch('../api/update-prices.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: productId,
                    prices: prices
                })
            });
        } catch (error) {
            console.error('Error updating prices:', error);
        }
    }

    async deleteProduct(productId) {
        if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
            return;
        }

        try {
            const response = await fetch('../api/delete-product.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: productId })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccess('Товар успешно удален!');
                await this.loadData();
                this.renderProductsTable();
            } else {
                this.showError('Ошибка удаления товара: ' + result.error);
            }
        } catch (error) {
            this.showError('Ошибка сети: ' + error.message);
        }
    }

    showAddProductModal() {
        document.getElementById('modalTitle').textContent = 'Добавить товар';
        document.getElementById('productForm').reset();
        this.currentEditProductId = null;
        this.openModal();
    }

    setupEventListeners() {
        // Sauvegarde automatique avec Ctrl+S
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveAllChanges();
            }
        });

        // Fermer le modal
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Échap pour fermer le modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    setupAutoSave() {
        // Sauvegarde automatique toutes les 30 secondes
        setInterval(() => {
            if (this.unsavedChanges.size > 0) {
                this.saveAllChanges();
            }
        }, 30000);
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type) {
        // Supprimer les notifications existantes
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Supprimer automatiquement après 5 secondes
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialiser l'admin manager
let adminManager;

document.addEventListener('DOMContentLoaded', function() {
    adminManager = new AdminManager();
});

// Fonctions globales pour les événements HTML
function saveAllChanges() {
    if (adminManager) adminManager.saveAllChanges();
}

function filterByCategory() {
    if (adminManager) adminManager.filterByCategory();
}

function showAddProductModal() {
    if (adminManager) adminManager.showAddProductModal();
}

function closeModal() {
    if (adminManager) adminManager.closeModal();
}

function saveProduct() {
    if (adminManager) adminManager.saveProduct();
}