function validateForm() {
    const storeNameSelect = document.getElementById('storeName');
    const lastNameInput = document.getElementById('lastName');

    let isValid = true;

    if (storeNameSelect.value === "") {
        document.getElementById('storeNameError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('storeNameError').style.display = 'none';
    }

    if (lastNameInput.value.trim() === "") {
        alert("Пожалуйста, введите фамилию сотрудника.");
        isValid = false;
    }

    return isValid;
}

function validateOrder(formData) {
    const itemNames = formData.getAll('itemName[]');
    const quantities = formData.getAll('quantity[]');

    for (let i = 0; i < quantities.length; i++) {
        if (parseInt(quantities[i]) > 0) {
            return true; // Есть хотя бы один выбранный товар
        }
    }

    alert("Ошибка: Вы не выбрали ни одного товара.");
    return false;
}
