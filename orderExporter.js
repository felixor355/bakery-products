function generateOrderData(formData) {
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

    return orderData;
}

function submitForm() {
    if (!validateForm() || !validateOrder(new FormData(document.getElementById('orderForm')))) return;

    const form = document.getElementById('orderForm');
    const formData = new FormData(form);
    const orderData = generateOrderData(formData);

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

function clearFormData() {
    localStorage.removeItem('formData');
    document.getElementById('storeName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('itemsContainer').innerHTML = '';
    document.getElementById('uploadFile').value = '';
    document.getElementById('loadButton').style.display = 'none';
}
