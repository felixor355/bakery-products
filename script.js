// Экспорт переменных для использования в других модулях
export let stores = {}; // Общая переменная для хранения данных о магазинах
export let categories = {};

// Загрузка начальных данных
export async function loadInitialData() {
    try {
        const [storesResponse, categoriesResponse] = await Promise.all([
            fetch('stores.json'),
            fetch('categories.json')
        ]);
        stores = await storesResponse.json(); // Загружаем данные в глобальную переменную
        categories = await categoriesResponse.json();

        const storeSelect = document.getElementById('storeName');
        Object.keys(stores).forEach(store => {
            const option = document.createElement('option');
            option.value = store;
            option.textContent = store;
            storeSelect.appendChild(option);
        });

        loadFormData();
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
}

// Рендеринг категорий для выбранного магазина
export function renderItems(storeName) {
    const itemsContainer = document.getElementById('itemsContainer');
    itemsContainer.innerHTML = ''; // Очищаем контейнер перед рендерингом

    const storeCategories = stores[storeName] || []; // Получаем категории для точки или пустой массив

    storeCategories.forEach(category => {
        const categoryDiv = document.createElement('details');
        categoryDiv.innerHTML = `
            <summary>${category.name}</summary>
            <div class="category-container">
                ${category.items.map(item => `
                    <div class="item-row">
                        <span>${item}</span>
                        <input type="hidden" name="itemName[]" value="${item}">
                        <input type="number" placeholder="Количество" name="quantity[]" min="0" max="1000">
                    </div>
                `).join('')}
            </div>
        `;
        itemsContainer.appendChild(categoryDiv);
    });
}

// Восстановление данных из localStorage
function loadFormData() {
    const storedData = JSON.parse(localStorage.getItem('formData'));

    if (storedData) {
        document.getElementById('storeName').value = storedData.storeName;
        document.getElementById('lastName').value = storedData.lastName;

        if (storedData.storeName) {
            renderItems(storedData.storeName); // Рендерим товары для сохраненной точки
        }
    }
}

// Обработчик изменения торговой точки
document.getElementById('storeName').addEventListener('change', function () {
    const selectedStore = this.value;
    if (selectedStore) {
        renderItems(selectedStore); // Рендерим товары для выбранной точки
    } else {
        document.getElementById('itemsContainer').innerHTML = ''; // Очищаем контейнер, если ничего не выбрано
    }
});

// Инициализация страницы
window.onload = loadInitialData;

// Импорт функций из fileHandler.js
import { handleFileSelection, processUploadedFile } from './fileHandler.js';

document.getElementById('uploadFile').addEventListener('change', handleFileSelection);
document.getElementById('loadButton').onclick = processUploadedFile;
