function shareTextViaWhatsApp() {
    console.log("shareTextViaWhatsApp вызван");

    if (!validateForm()) {
        console.error("Ошибка валидации формы");
        return;
    }

    if (!validateOrder(new FormData(document.getElementById('orderForm')))) {
        console.error("Ошибка валидации заказа");
        return;
    }

    const form = document.getElementById('orderForm');
    const formData = new FormData(form);
    console.log("Данные формы:", Object.fromEntries(formData));

    const orderData = generateOrderData(formData);
    console.log("Текст заказа:", orderData);

    const whatsappMessage = encodeURIComponent(orderData);
    const whatsappLink = `https://wa.me/?text=${whatsappMessage}`;
    console.log("Ссылка WhatsApp:", whatsappLink);

    window.open(whatsappLink, '_blank');
    clearFormData();
}
