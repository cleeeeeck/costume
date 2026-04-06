const products = {
    gray: {
        id: "126993",
        name: "Стильний теплий костюм",
        colorName: "Сірий",
        images: ["images/photo-5.jpg", "images/photo-6.jpg", "images/photo-7.jpg", "images/photo-8.jpg"]
    },
    brown: {
        id: "126996",
        name: "Стильний теплий костюм",
        colorName: "Капучіно",
        images: ["images/photo-1.jpg", "images/photo-2.jpg", "images/photo-3.jpg", "images/photo-4.jpg"]
    }
};

let currentProduct = 'gray';
let currentSlide = 0;
const carouselInner = document.getElementById('carousel-inner');

function renderCarousel() {
    const product = products[currentProduct];
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
    currentSlide = index;
    if (currentSlide >= products[currentProduct].images.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = products[currentProduct].images.length - 1;
    carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }

let autoInterval = setInterval(nextSlide, 5000);
const carousel = document.querySelector('.carousel');
if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(autoInterval));
    carousel.addEventListener('mouseleave', () => autoInterval = setInterval(nextSlide, 5000));
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
            document.getElementById('product-title').textContent = p.name;
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
            if (e.target.tagName !== 'SELECT' && e.target.type !== 'checkbox') {
                const checkbox = div.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
            }
            updateTotalPrice();
        });

        div.querySelector('input[type="checkbox"]').addEventListener('change', updateTotalPrice);
        div.querySelector('select').addEventListener('change', updateTotalPrice);

        container.appendChild(div);
    });
}

function updateTotalPrice() {
    const checkedCount = document.querySelectorAll('#color-checkboxes input[type="checkbox"]:checked').length;
    const total = checkedCount * 1599;
    document.getElementById('total-price').innerHTML = `Сума: <strong>${total} грн</strong>`;
}

function openModal() {
    renderColorCheckboxes();
    updateTotalPrice();

    document.getElementById('orderForm').reset();
    document.getElementById('phone').value = '+380';

    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

document.getElementById('orderForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();

    const selectedItems = [];

    document.querySelectorAll('#color-checkboxes input[type="checkbox"]:checked').forEach(checkbox => {
        const colorKey = checkbox.value;
        const product = products[colorKey];
        const sizeSelect = checkbox.parentElement.querySelector('select');
        const size = sizeSelect ? sizeSelect.value : '48-50';

        selectedItems.push({
            color: product.colorName,
            id: product.id,
            size: size
        });
    });

    if (!name || !phone || phone.length < 10) {
        alert('Будь ласка, заповніть ім’я та коректний номер телефону');
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
${itemsText}
💰 Загальна сума: ${totalPrice} грн
    `.trim();

    const BOT_TOKEN = 'ВСТАВ_СЮДИ_ТОКЕН_БОТА';
    const CHAT_ID = 'ВСТАВ_СЮДИ_CHAT_ID';

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: message })
        });

        if (response.ok) {
            alert('✅ Замовлення успішно відправлено!\nМи скоро з вами зв’яжемося.');
            closeModal();
        } else {
            alert('Помилка при відправці. Спробуйте ще раз.');
        }
    } catch (err) {
        alert('Помилка з’єднання. Перевірте інтернет.');
    }
});


function toggleSpoiler(button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('.spoiler-icon');
    if (!content || !icon) return;

    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
        content.style.maxHeight = null;
        icon.textContent = '+';
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        icon.textContent = '−';
    }
}

const modal = document.getElementById('modal');
const privacyModal = document.getElementById('privacy-modal');

function openPrivacyModal() {
    privacyModal.style.display = 'flex';
}

function closePrivacyModal() {
    privacyModal.style.display = 'none';
}

modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
privacyModal.addEventListener('click', e => { if (e.target === privacyModal) closePrivacyModal(); });

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (modal.style.display === 'flex') closeModal();
        if (privacyModal.style.display === 'flex') closePrivacyModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderColorOptions();
    renderCarousel();

    const firstContent = document.querySelector('.spoiler-content');
    if (firstContent) {
        firstContent.style.maxHeight = firstContent.scrollHeight + "px";
        const firstIcon = firstContent.previousElementSibling?.querySelector('.spoiler-icon');
        if (firstIcon) firstIcon.textContent = '−';
    }
});