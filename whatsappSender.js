function shareTextViaWhatsApp() {
    if (!validateForm() || !validateOrder(new FormData(document.getElementById('orderForm')))) return;

    const form = document.getElementById('orderForm');
    const formData = new FormData(form);
    const orderData = generateOrderData(formData);

    const whatsappMessage = encodeURIComponent(orderData);
    const whatsappLink = `https://wa.me/?text=${whatsappMessage}`;
    window.open(whatsappLink, '_blank');

    clearFormData();
}
