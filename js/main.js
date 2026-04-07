const products = {
    gray: {
        id: "126993",
        name: "Стильний теплий костюм",
        colorName: "Сірий",
        colorValue: "сірий",
        images: ["images/photo-5.jpg", "images/photo-6.jpg", "images/photo-7.jpg", "images/photo-8.jpg"]
    },
    brown: {
        id: "126996",
        name: "Стильний теплий костюм",
        colorName: "Капучіно",
        colorValue: "капучіно",
        images: ["images/photo-1.jpg", "images/photo-2.jpg", "images/photo-3.jpg", "images/photo-4.jpg"]
    }
};

let currentProduct = 'gray';
let currentSlide = 0;
let autoInterval = null;
let scrollPosition = 0;

const carouselInner = document.getElementById('carousel-inner');
const carousel = document.querySelector('.carousel');
const modal = document.getElementById('modal');
const privacyModal = document.getElementById('privacy-modal');
const orderForm = document.getElementById('orderForm');
const submitBtn = document.getElementById('submit-btn');

function updateProductInfo() {
    const product = products[currentProduct];
    const title = document.getElementById('product-title');
    const colorValue = document.getElementById('product-color-value');

    if (title && product) {
        title.textContent = product.name;
    }

    if (colorValue && product) {
        colorValue.textContent = product.colorValue;
    }
}

function renderCarousel() {
    const product = products[currentProduct];
    if (!carouselInner || !product) return;

    carouselInner.innerHTML = '';

    product.images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${product.name} - фото ${index + 1}`;
        img.className = 'carousel-item';
        carouselInner.appendChild(img);
    });

    currentSlide = 0;
    showSlide(0);
}

function showSlide(index) {
    const product = products[currentProduct];
    if (!product || !carouselInner) return;

    currentSlide = index;

    if (currentSlide >= product.images.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = product.images.length - 1;

    carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function startAutoSlide() {
    stopAutoSlide();
    autoInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
    if (autoInterval) {
        clearInterval(autoInterval);
        autoInterval = null;
    }
}

if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
}

function renderColorOptions() {
    const container = document.getElementById('color-options');
    if (!container) return;

    container.innerHTML = '';

    Object.keys(products).forEach(key => {
        const p = products[key];
        const div = document.createElement('div');
        div.className = `color-option ${key === currentProduct ? 'active' : ''}`;
        div.innerHTML = `
            <img src="${p.images[0]}" alt="${p.colorName}">
            <span>${p.colorName}</span>
        `;

        div.addEventListener('click', () => {
            if (currentProduct === key) return;

            currentProduct = key;
            updateProductInfo();
            renderColorOptions();
            renderCarousel();
        });

        container.appendChild(div);
    });
}

function renderColorCheckboxes() {
    const container = document.getElementById('color-checkboxes');
    if (!container) return;

    container.innerHTML = '';

    Object.keys(products).forEach(key => {
        const p = products[key];

        const div = document.createElement('div');
        div.className = 'color-checkbox-item';
        div.innerHTML = `
            <input type="checkbox" id="check-${key}" value="${key}" ${key === currentProduct ? 'checked' : ''}>
            <img src="${p.images[0]}" alt="${p.colorName}">
            <div class="color-info">
                <span>${p.colorName}</span>
                <select class="color-select" data-color="${key}">
                    <option value="48-50">48-50</option>
                    <option value="52-54">52-54</option>
                    <option value="56-58">56-58</option>
                    <option value="60-62">60-62</option>
                </select>
            </div>
            <strong>1599 грн</strong>
        `;

        div.addEventListener('click', (e) => {
            const isSelect = e.target.tagName === 'SELECT';
            const isOption = e.target.tagName === 'OPTION';
            const isCheckbox = e.target.type === 'checkbox';

            if (!isSelect && !isOption && !isCheckbox) {
                const checkbox = div.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                updateTotalPrice();
            }
        });

        const checkbox = div.querySelector('input[type="checkbox"]');
        const select = div.querySelector('select');

        checkbox.addEventListener('change', updateTotalPrice);
        select.addEventListener('change', updateTotalPrice);

        container.appendChild(div);
    });
}

function updateTotalPrice() {
    const checkedCount = document.querySelectorAll('#color-checkboxes input[type="checkbox"]:checked').length;
    const total = checkedCount * 1599;
    const totalPriceElement = document.getElementById('total-price');

    if (totalPriceElement) {
        totalPriceElement.innerHTML = `Сума: <strong>${total} грн</strong>`;
    }
}

function lockBodyScroll() {
    scrollPosition = window.scrollY || window.pageYOffset;
    document.body.classList.add('modal-open');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
}

function unlockBodyScroll() {
    document.body.classList.remove('modal-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollPosition);
}

function openModal() {
    if (!orderForm || !modal) return;

    orderForm.reset();
    document.getElementById('phone').value = '+380';

    renderColorCheckboxes();
    updateTotalPrice();

    submitBtn.disabled = false;
    submitBtn.textContent = 'Замовити';

    lockBodyScroll();
    modal.style.display = 'flex';
}

function closeModal() {
    if (!modal) return;

    modal.style.display = 'none';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Замовити';
    unlockBodyScroll();
}

function openPrivacyModal() {
    if (!privacyModal) return;
    lockBodyScroll();
    privacyModal.style.display = 'flex';
}

function closePrivacyModal() {
    if (!privacyModal) return;
    privacyModal.style.display = 'none';
    unlockBodyScroll();
}

function normalizePhone(phone) {
    return phone.replace(/\D/g, '');
}

function isValidPhone(phone) {
    const digits = normalizePhone(phone);

    if (digits.startsWith('380') && digits.length === 12) return true;
    if (digits.startsWith('0') && digits.length === 10) return true;

    return false;
}

if (orderForm) {
    orderForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();

        const selectedItems = [];

        document.querySelectorAll('#color-checkboxes input[type="checkbox"]:checked').forEach(checkbox => {
            const colorKey = checkbox.value;
            const product = products[colorKey];
            const parent = checkbox.closest('.color-checkbox-item');
            const sizeSelect = parent ? parent.querySelector('select') : null;
            const size = sizeSelect ? sizeSelect.value : '48-50';

            if (product) {
                selectedItems.push({
                    color: product.colorName,
                    id: product.id,
                    size: size
                });
            }
        });

        if (!name) {
            alert('Будь ласка, вкажіть ім’я');
            return;
        }

        if (!isValidPhone(phone)) {
            alert('Будь ласка, введіть коректний номер телефону');
            return;
        }

        if (selectedItems.length === 0) {
            alert('Оберіть хоча б один колір!');
            return;
        }

        let itemsText = '';
        selectedItems.forEach(item => {
            itemsText += `• ${item.color} (${item.id}) — розмір ${item.size}\n`;
        });

        const totalPrice = selectedItems.length * 1599;

        const message = `
🛒 Нове замовлення!

👤 Ім'я: ${name}
📱 Телефон: ${phone}
🧥 Товар: Стильний теплий костюм

Кольори та розміри:
${itemsText}💰 Загальна сума: ${totalPrice} грн
        `.trim();

        const BOT_TOKEN = 'ВСТАВ_СЮДИ_ТОКЕН_БОТА';
        const CHAT_ID = 'ВСТАВ_СЮДИ_CHAT_ID';

        submitBtn.disabled = true;
        submitBtn.textContent = 'Відправляємо...';

        try {
            const response = await fetch(`[api.telegram.org](https://api.telegram.org/bot${BOT_TOKEN}/sendMessage)`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message
                })
            });

            if (response.ok) {
                alert('✅ Замовлення успішно відправлено!\nМи скоро з вами зв’яжемося.');
                closeModal();
                orderForm.reset();
            } else {
                alert('Помилка при відправці. Спробуйте ще раз.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Замовити';
            }
        } catch (err) {
            alert('Помилка з’єднання. Перевірте інтернет.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Замовити';
        }
    });
}

function toggleSpoiler(button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('.spoiler-icon');
    if (!content || !icon) return;

    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
        content.style.maxHeight = null;
        icon.textContent = '+';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.textContent = '−';
    }
}

if (modal) {
    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });
}

if (privacyModal) {
    privacyModal.addEventListener('click', e => {
        if (e.target === privacyModal) closePrivacyModal();
    });
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (modal && modal.style.display === 'flex') closeModal();
        if (privacyModal && privacyModal.style.display === 'flex') closePrivacyModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateProductInfo();
    renderColorOptions();
    renderCarousel();
    startAutoSlide();

    const firstContent = document.querySelector('.spoiler-content');
    if (firstContent) {
        firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
        const firstIcon = firstContent.previousElementSibling?.querySelector('.spoiler-icon');
        if (firstIcon) firstIcon.textContent = '−';
    }
});
