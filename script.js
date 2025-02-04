let stores = {};
let categories = [];

async function loadInitialData() {
    try {
        const [storesResponse, categoriesResponse] = await Promise.all([
            fetch('stores.json'),
            fetch('categories.json')
        ]);
        stores = await storesResponse.json();
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

function renderItems(storeName) {
    const itemsContainer = document.getElementById('itemsContainer');
    itemsContainer.innerHTML = '';

    const storeCategories = stores[storeName] || [];

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

function loadFormData() {
    const storedData = JSON.parse(localStorage.getItem('formData'));

    if (storedData) {
        document.getElementById('storeName').value = storedData.storeName;
        document.getElementById('lastName').value = storedData.lastName;

        if (storedData.storeName) {
            renderItems(storedData.storeName);
        }
    }
}

document.getElementById('storeName').addEventListener('change', function () {
    const selectedStore = this.value;
    if (selectedStore) {
        renderItems(selectedStore);
    } else {
        document.getElementById('itemsContainer').innerHTML = '';
    }
});

window.onload = loadInitialData;
