// Загрузка данных о магазинах и категориях
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

        // Заполнение выпадающего списка магазинов
        const storeSelect = document.getElementById('storeName');
        Object.keys(stores).forEach(store => {
            const option = document.createElement('option');
            option.value = store;
            option.textContent = store;
            storeSelect.appendChild(option);
        });

        // Инициализация формы
        loadFormData();
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
}

// Рендеринг категорий для выбранного магазина
function renderItems(storeName) {
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
                        <input type="number" placeholder="Количество" name="quantity[]" min="0" max="1000"> <!-- Убрали required -->
                    </div>
                `).join('')}
            </div>
        `;
        itemsContainer.appendChild(categoryDiv);
    });
}

//Импорт из файла
document.getElementById('uploadFile').addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    const storeNameSelect = document.getElementById('storeName');
    const selectedStore = storeNameSelect.value;

    // Проверяем выбранную торговую точку
    if (!selectedStore) {
        alert("Пожалуйста, выберите торговую точку перед загрузкой файла.");
        return;
    }

    // Проверяем имя файла
    if (!file || file.name !== 'ceh.txt') {
        alert("Ошибка: Загрузите файл с именем 'ceh.txt'.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const fileContent = e.target.result.trim(); // Удаляем лишние пробелы
        const lines = fileContent.split('\n').map(line => line.trim()); // Разделяем по строкам и очищаем каждую строку

        // Очищаем текущие категории для выбранной торговой точки
        if (!stores[selectedStore]) {
            stores[selectedStore] = [];
        } else {
            stores[selectedStore].splice(0, stores[selectedStore].length); // Полностью очищаем массив
        }

        let currentCategory = null;

        lines.forEach(line => {
            if (line.startsWith('#')) { // Новая категория начинается с '#'
                const categoryName = line.slice(1).trim();
                if (categoryName) {
                    currentCategory = { name: categoryName, items: [] };
                    stores[selectedStore].push(currentCategory);
                }
            } else if (currentCategory && line !== '') {
                currentCategory.items.push(line);
            }
        });

        // Перерисовываем интерфейс
        renderItems(selectedStore);
        alert("Список товаров успешно обновлен!");

        // Очищаем input файла для следующей загрузки
        document.getElementById('uploadFile').value = '';
    };

    reader.onerror = function () {
        alert("Ошибка чтения файла. Попробуйте снова.");
    };

    reader.readAsText(file);
}
// Валидация формы
function validateForm() {
    const storeNameSelect = document.getElementById('storeName');
    const lastNameInput = document.getElementById('lastName');

    let isValid = true;

    // Проверка торговой точки
    if (storeNameSelect.value === "") {
        document.getElementById('storeNameError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('storeNameError').style.display = 'none';
    }

    // Проверка фамилии сотрудника
    if (lastNameInput.value.trim() === "") {
        alert("Пожалуйста, введите фамилию сотрудника.");
        isValid = false;
    }

    return isValid;
}

// Сохранение данных формы
function saveFormData() {
    if (!validateForm()) return;

    const form = document.getElementById('orderForm');
    const formData = new FormData(form);

    const savedData = {
        storeName: formData.get('storeName'),
        lastName: formData.get('lastName'),
        items: Array.from(document.querySelectorAll('.item-row')).map(row => ({
            itemName: row.querySelector('[name="itemName[]"]').value,
            quantity: row.querySelector('[name="quantity[]"]').value
        }))
    };

    localStorage.setItem('formData', JSON.stringify(savedData));
}

// Загрузка сохраненных данных из localStorage
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

// Экспорт данных в текстовый файл
function submitForm() {
    if (!validateForm()) return;

    const form = document.getElementById('orderForm');
    const formData = new FormData(form);

    let orderData = `Название торговой точки: ${formData.get('storeName')}\n`;
    orderData += `Фамилия сотрудника: ${formData.get('lastName')}\n`;
    orderData += `Дата: ${new Date().toISOString().slice(0, 10)}\n`;
    orderData += `Заказ:\n`;

    const itemNames = formData.getAll('itemName[]');
    const quantities = formData.getAll('quantity[]');

    const filteredItems = [];
    for (let i = 0; i < itemNames.length; i++) {
        if (quantities[i] && parseInt(quantities[i]) > 0) { // Учитываем только товары с количеством > 0
            filteredItems.push(`${itemNames[i]} - ${quantities[i]}`);
        }
    }

    if (filteredItems.length > 0) {
        orderData += `Выпечка:\n`;
        filteredItems.forEach(item => {
            orderData += `${item}\n`;
        });
    } else {
        orderData += "Товары не выбраны.\n";
    }

    const storeName = formData.get('storeName').replace(/\s+/g, '_');
    const date = new Date().toISOString().slice(0, 10);
    const fileName = `${storeName}_${date}.txt`;

    const blob = new Blob([orderData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);

    clearFormData();
}

// Отправка данных через WhatsApp
function shareTextViaWhatsApp() {
    if (!validateForm()) return;

    const form = document.getElementById('orderForm');
    const formData = new FormData(form);

    let orderData = `Название торговой точки: ${formData.get('storeName')}\n`;
    orderData += `Фамилия сотрудника: ${formData.get('lastName')}\n`;
    orderData += `Дата: ${new Date().toISOString().slice(0, 10)}\n`;
    orderData += `Заказ:\n`;

    const itemNames = formData.getAll('itemName[]');
    const quantities = formData.getAll('quantity[]');

    const filteredItems = [];
    for (let i = 0; i < itemNames.length; i++) {
        if (quantities[i] && parseInt(quantities[i]) > 0) {
            filteredItems.push(`${itemNames[i]} - ${quantities[i]}`);
        }
    }

    if (filteredItems.length > 0) {
        orderData += `Выпечка:\n`;
        filteredItems.forEach(item => {
            orderData += `${item}\n`;
        });
    } else {
        orderData += "Товары не выбраны.\n";
    }

    const whatsappMessage = encodeURIComponent(orderData);
    const whatsappLink = `https://wa.me/?text=${whatsappMessage}`;
    window.open(whatsappLink, '_blank');

    clearFormData();
}

// Очистка данных формы
function clearFormData() {
    localStorage.removeItem('formData');
    document.getElementById('storeName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('itemsContainer').innerHTML = '';
}

// Инициализация страницы
document.getElementById('storeName').addEventListener('change', function () {
    const selectedStore = this.value;
    if (selectedStore) {
        renderItems(selectedStore);
    } else {
        document.getElementById('itemsContainer').innerHTML = '';
    }
});

window.onload = loadInitialData;
