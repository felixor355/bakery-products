let uploadedFile = null;

document.getElementById('uploadFile').addEventListener('change', handleFileSelection);

function handleFileSelection(event) {
    // Логика обработки выбора файла
}

function processUploadedFile() {
    // Логика обработки файла
}

// Экспортируем функции в глобальную область видимости
window.fileHandler = {
    processUploadedFile,
};

export function handleFileSelection(event) {
    const file = event.target.files[0];
    const storeNameSelect = document.getElementById('storeName');
    const selectedStore = storeNameSelect.value;

    if (!selectedStore) {
        alert("Пожалуйста, выберите торговую точку перед загрузкой файла.");
        return;
    }

    if (!file || file.name !== 'ceh.txt') {
        alert("Ошибка: Загрузите файл с именем 'ceh.txt'.");
        document.getElementById('loadButton').style.display = 'none';
        return;
    }

    uploadedFile = file;
    document.getElementById('loadButton').style.display = 'block';
}

export function processUploadedFile() {
    const storeNameSelect = document.getElementById('storeName');
    const selectedStore = storeNameSelect.value;

    if (!uploadedFile) {
        alert("Файл не выбран.");
        return;
    }

    if (!selectedStore) {
        alert("Пожалуйста, выберите торговую точку.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const fileContent = e.target.result.trim();
        const lines = fileContent.split('\n').map(line => line.trim());

        if (!lines.some(line => line.startsWith('#'))) {
            alert("Ошибка: Файл имеет некорректный формат. Категории должны начинаться с '#'.");
            return;
        }

        if (!stores[selectedStore]) {
            stores[selectedStore] = [];
        } else {
            stores[selectedStore].splice(0, stores[selectedStore].length);
        }

        let currentCategory = null;

        lines.forEach(line => {
            if (line.startsWith('#')) {
                const categoryName = line.slice(1).trim();
                if (categoryName) {
                    currentCategory = { name: categoryName, items: [] };
                    stores[selectedStore].push(currentCategory);
                }
            } else if (currentCategory && line !== '') {
                currentCategory.items.push(line);
            }
        });

        renderItems(selectedStore);
        alert("Список товаров успешно обновлен!");

        uploadedFile = null;
        document.getElementById('uploadFile').value = '';
        document.getElementById('loadButton').style.display = 'none';
    };

    reader.onerror = function () {
        alert("Ошибка чтения файла. Попробуйте снова.");
    };

    reader.readAsText(uploadedFile);
}
