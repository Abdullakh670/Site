
$(document).ready(function() {
    
    // ============================================
    // 1. COUNTDOWN TIMER (Home Page)
    // ============================================
    if ($('#timer').length) {
        let targetDate = new Date().getTime() + (7 * 24 * 60 * 60 * 1000); 
        
        setInterval(function() {
            let now = new Date().getTime();
            let diff = targetDate - now;
            
            let days = Math.floor(diff / (1000 * 60 * 60 * 24));
            let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            let secs = Math.floor((diff % (1000 * 60)) / 1000);
            
            $('#days').text(days < 10 ? '0' + days : days);
            $('#hours').text(hours < 10 ? '0' + hours : hours);
            $('#mins').text(mins < 10 ? '0' + mins : mins);
            $('#secs').text(secs < 10 ? '0' + secs : secs);
        }, 1000);
    }

    // ============================================
    // 2. STATISTICS COUNTER ANIMATION (Home Page)
    // ============================================
    if ($('.stats-section').length) {
        let animated = false;
        
        $(window).scroll(function() {
            let topOfWindow = $(window).scrollTop();
            let topOfSection = $('.stats-section').offset().top - window.innerHeight + 150;
            
            if (topOfWindow > topOfSection && !animated) {
                $('.stat-number').each(function() {
                    let $this = $(this);
                    let target = $this.data('target');
                    
                    $({ count: 0 }).animate({ count: target }, {
                        duration: 2500,
                        easing: 'swing',
                        step: function() { $this.text(Math.ceil(this.count)); },
                        complete: function() { $this.text(target); }
                    });
                });
                animated = true;
            }
        });
    }

    // ============================================
    // 3. STORE LOGIC (Store Page) - Arrays & DOM
    // ============================================
    if ($('#productsGrid').length) {
        
        // Product Array
        const products = [
            { id: 1, name: "Inter Home Jersey 26/27", category: "Kits", price: 95.00 },
            { id: 2, name: "Inter Away Jersey 26/27", category: "Kits", price: 90.00 },
            { id: 3, name: "Training Top Black", category: "Training", price: 65.00 },
            { id: 4, name: "Pre-Match Jacket", category: "Training", price: 80.00 },
            { id: 5, name: "Inter Scarf", category: "Accessories", price: 25.00 },
            { id: 6, name: "Inter Beanie", category: "Accessories", price: 20.00 }
        ];

        // Render Products
        function renderProducts(productList) {
            $('#productsGrid').empty();
            if (productList.length === 0) {
                $('#productsGrid').append('<div class="col-12 text-center text-muted">No products found.</div>');
                return;
            }

            productList.forEach(product => {
                const card = `
                    <div class="col-md-4">
                        <div class="card product-card h-100 shadow-sm">
                            <div class="store-placeholder-img">Image: ${product.name}</div>
                            <div class="card-body d-flex flex-column">
                                <span class="badge bg-secondary mb-2 align-self-start">${product.category}</span>
                                <h6 class="card-title fw-bold">${product.name}</h6>
                                <p class="card-text text-primary fw-bold mb-3">€${product.price.toFixed(2)}</p>
                                <button class="btn btn-outline-primary mt-auto fw-bold" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                `;
                // DOM Manipulation (.append)
                $('#productsGrid').append(card);
            });
        }

        // Initial Render
        renderProducts(products);

        // Filter and Search Logic
        function filterProducts() {
            const searchTerm = $('#searchInput').val().toLowerCase();
            const category = $('#categoryFilter').val();
            const sort = $('#priceSort').val();

            let filtered = products.filter(p => {
                const matchSearch = p.name.toLowerCase().includes(searchTerm);
                const matchCategory = (category === 'All' || p.category === category);
                return matchSearch && matchCategory;
            });

            if (sort === 'low') {
                filtered.sort((a, b) => a.price - b.price);
            } else if (sort === 'high') {
                filtered.sort((a, b) => b.price - a.price);
            }

            renderProducts(filtered);
        }

        $('#searchInput').on('keyup', filterProducts);
        $('#categoryFilter').on('change', filterProducts);
        $('#priceSort').on('change', filterProducts);

        // ============================================
        // 4. CART & LOCAL STORAGE LOGIC
        // ============================================
        
        // Initialize cart from localStorage OR empty array
        window.cart = JSON.parse(localStorage.getItem('interCart')) || [];
        updateCartUI();

        window.addToCart = function(id, name, price) {
            const existingItem = window.cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                window.cart.push({ id, name, price, qty: 1 });
            }
            saveAndRenderCart();
        };

        window.removeFromCart = function(id) {
            window.cart = window.cart.filter(item => item.id !== id);
            saveAndRenderCart();
        };

        window.clearCart = function() {
            window.cart = [];
            saveAndRenderCart();
        };

        function saveAndRenderCart() {
            // Save to browser memory
            localStorage.setItem('interCart', JSON.stringify(window.cart));
            updateCartUI();
        }

        function updateCartUI() {
            $('#cartItemsList').empty();
            let total = 0;

            if (window.cart.length === 0) {
                $('#cartItemsList').append('<li class="list-group-item text-muted text-center small">Cart is empty</li>');
            } else {
                window.cart.forEach(item => {
                    total += item.price * item.qty;
                    const li = `
                        <li class="list-group-item d-flex justify-content-between align-items-center small p-2">
                            <div>
                                <strong>${item.name}</strong><br>
                                <span class="text-muted">€${item.price.toFixed(2)} x ${item.qty}</span>
                            </div>
                            <button class="btn btn-sm btn-danger py-0 px-2" onclick="removeFromCart(${item.id})">X</button>
                        </li>
                    `;
                    $('#cartItemsList').append(li);
                });
            }
            $('#cartTotal').text(`€${total.toFixed(2)}`);
        }
    }
});
