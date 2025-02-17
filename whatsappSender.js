document.addEventListener('DOMContentLoaded', () => {
    const whatsappButton = document.querySelector('.green-button');

    if (whatsappButton) {
        whatsappButton.addEventListener('click', shareTextViaWhatsApp);
    }

    function shareTextViaWhatsApp() {
        console.log("Кнопка 'Поделиться в WhatsApp' нажата");

        if (!validateForm() || !validateOrder(new FormData(document.getElementById('orderForm')))) return;

        const form = document.getElementById('orderForm');
        const formData = new FormData(form);
        const orderData = generateOrderData(formData);
        const whatsappMessage = encodeURIComponent(orderData);
        const whatsappLink = `https://wa.me/?text=${whatsappMessage}`;

        window.open(whatsappLink, '_blank');
        clearFormData();
    }
});
