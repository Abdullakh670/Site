document.addEventListener("DOMContentLoaded", () => {
    // --- ОБЩЕЕ НА ВСЕХ СТРАНИЦАХ ---
    // Обновление счетчика корзины (через localStorage, чтобы работало везде)
    function updateCartBadge() {
        const badges = document.querySelectorAll(".cart-badge");
        let cartCount = localStorage.getItem("interCartCount") || 0;
        badges.forEach(badge => badge.innerText = cartCount);
    }
    updateCartBadge();


    // --- 1. ГЛАВНАЯ СТРАНИЦА (index.html) ---
    // Таймер до следующего матча
    const countdownEl = document.getElementById("countdown");
    if (countdownEl) {
        // Устанавливаем дату матча (условно через 3 дня)
        const matchDate = new Date();
        matchDate.setDate(matchDate.getDate() + 3);
        
        setInterval(() => {
            const now = new Date();
            const diff = matchDate - now;
            
            if (diff <= 0) {
                countdownEl.innerHTML = "Матч начался!";
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const mins = Math.floor((diff / 1000 / 60) % 60);
            const secs = Math.floor((diff / 1000) % 60);
            
            countdownEl.innerHTML = `До матча: <b>${days}д ${hours}ч ${mins}м ${secs}с</b>`;
        }, 1000);
    }


    // --- 2. ИСТОРИЯ (history.html) ---
    // Скрытый интересный факт
    const factBtn = document.getElementById("factBtn");
    const factText = document.getElementById("factText");
    if (factBtn && factText) {
        factBtn.addEventListener("click", () => {
            factText.classList.toggle("d-none");
            if (factText.classList.contains("d-none")) {
                factBtn.innerText = "Показать интересный факт";
                factBtn.classList.replace("btn-danger", "btn-inter");
            } else {
                factBtn.innerText = "Скрыть факт";
                factBtn.classList.replace("btn-inter", "btn-danger");
            }
        });
    }


    // --- 3. БИЛЕТЫ (tickets.html) ---
    // Динамический подсчет стоимости билетов
    const ticketForm = document.getElementById("ticketForm");
    const matchSelect = document.getElementById("matchSelect");
    const ticketCount = document.getElementById("ticketCount");
    const totalPriceEl = document.getElementById("totalPrice");

    if (ticketForm && matchSelect && ticketCount && totalPriceEl) {
        function calculateTotal() {
            const price = parseInt(matchSelect.options[matchSelect.selectedIndex].dataset.price);
            const count = parseInt(ticketCount.value);
            totalPriceEl.innerText = `Итого к оплате: €${price * count}`;
        }

        // Пересчитываем при изменении данных
        matchSelect.addEventListener("change", calculateTotal);
        ticketCount.addEventListener("input", calculateTotal);
        calculateTotal(); // Инициализация

        ticketForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("nameInput").value;
            if (name.trim() === "") {
                alert("Пожалуйста, введите ваше Имя и Фамилию.");
                return;
            }
            alert(`Грацие, ${name}! Билеты забронированы.
Сумма: ${totalPriceEl.innerText.replace('Итого к оплате: ', '')}`);
            ticketForm.reset();
            calculateTotal();
        });
    }


    // --- 4. МАГАЗИН (store.html) ---
    // Добавление товаров в корзину (сохраняется при переходе по страницам)
    const storeButtons = document.querySelectorAll(".add-to-cart-btn");
    if (storeButtons.length > 0) {
        storeButtons.forEach(button => {
            button.addEventListener("click", () => {
                let currentCount = parseInt(localStorage.getItem("interCartCount") || 0);
                localStorage.setItem("interCartCount", currentCount + 1);
                updateCartBadge();
                
                const productName = button.parentElement.querySelector(".card-title").innerText;
                alert(`"${productName}" добавлен в корзину!`);
            });
        });
    }
});