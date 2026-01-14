/* ============================================
   BERTRAND CAFE - WINERY PAGE SCRIPTS
   Filtering, Sorting & Cart Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');
    const sortSelect = document.getElementById('sortSelect');
    const resultsCount = document.getElementById('resultsCount');
    const wineryGrid = document.getElementById('wineryGrid');
    
    // Cart Elements
    const cartToggle = document.getElementById('wineryCartToggle');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartDrawerClose = document.getElementById('cartDrawerClose');
    const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
    const cartDrawerBody = document.getElementById('cartDrawerBody');
    const cartDrawerFooter = document.getElementById('cartDrawerFooter');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartCount = document.getElementById('wineryCartCount');
    const addToCartBtns = document.querySelectorAll('.btn-add-cart');
    
    // Cart State
    let cart = [];
    
    // ============================================
    // CATEGORY FILTERING
    // ============================================
    
    let currentCategory = 'all';
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentCategory = category;
            filterAndSort();
        });
    });
    
    // ============================================
    // SORTING
    // ============================================
    
    sortSelect.addEventListener('change', () => {
        filterAndSort();
    });
    
    function filterAndSort() {
        const sortValue = sortSelect.value;
        let visibleCards = [];
        
        // Filter by category
        productCards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (currentCategory === 'all' || cardCategory === currentCategory) {
                card.classList.remove('hidden');
                card.classList.add('visible');
                visibleCards.push(card);
            } else {
                card.classList.add('hidden');
                card.classList.remove('visible');
            }
        });
        
        // Sort visible cards
        visibleCards.sort((a, b) => {
            const priceA = parseInt(a.dataset.price);
            const priceB = parseInt(b.dataset.price);
            const nameA = a.dataset.name.toLowerCase();
            const nameB = b.dataset.name.toLowerCase();
            
            switch (sortValue) {
                case 'price-asc':
                    return priceA - priceB;
                case 'price-desc':
                    return priceB - priceA;
                case 'name-asc':
                    return nameA.localeCompare(nameB);
                case 'name-desc':
                    return nameB.localeCompare(nameA);
                default:
                    return 0; // Featured - keep original order
            }
        });
        
        // Re-append sorted cards
        visibleCards.forEach(card => {
            wineryGrid.appendChild(card);
        });
        
        // Update results count
        updateResultsCount(visibleCards.length);
    }
    
    function updateResultsCount(count) {
        const categoryName = currentCategory === 'all' ? 'products' : currentCategory;
        resultsCount.textContent = `Showing ${count} ${categoryName}`;
    }
    
    // Initialize
    updateResultsCount(productCards.length);
    
    // ============================================
    // CART FUNCTIONALITY
    // ============================================
    
    // Toggle Cart Drawer
    cartToggle.addEventListener('click', () => {
        openCart();
    });
    
    cartDrawerClose.addEventListener('click', () => {
        closeCart();
    });
    
    cartDrawerOverlay.addEventListener('click', () => {
        closeCart();
    });
    
    function openCart() {
        cartDrawer.classList.add('active');
        cartDrawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeCart() {
        cartDrawer.classList.remove('active');
        cartDrawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Add to Cart
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const itemName = btn.dataset.item;
            const itemPrice = parseInt(btn.dataset.price);
            
            addToCart(itemName, itemPrice);
            
            // Visual feedback
            btn.classList.add('added');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Added</span>
            `;
            
            setTimeout(() => {
                btn.classList.remove('added');
                btn.innerHTML = originalHTML;
            }, 1500);
        });
    });
    
    function addToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }
        
        updateCartUI();
    }
    
    function removeFromCart(name) {
        cart = cart.filter(item => item.name !== name);
        updateCartUI();
    }
    
    function updateQuantity(name, delta) {
        const item = cart.find(item => item.name === name);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                removeFromCart(name);
            } else {
                updateCartUI();
            }
        }
    }
    
    function updateCartUI() {
        // Update cart count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart body
        if (cart.length === 0) {
            cartDrawerBody.innerHTML = `
                <div class="cart-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M4 10c0 0 0-3 8-3s8 3 8 3" />
                        <path d="M3 10h18v2c0 5-3 9-9 9s-9-4-9-9v-2z" />
                    </svg>
                    <p>Your basket is empty</p>
                    <span>Add drinks from the collection to begin your order</span>
                </div>
            `;
            cartDrawerFooter.style.display = 'none';
        } else {
            let itemsHTML = '';
            cart.forEach(item => {
                itemsHTML += `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <span class="cart-item-price">R${item.price} each</span>
                        </div>
                        <div class="cart-item-qty">
                            <button class="qty-btn" data-action="decrease" data-item="${item.name}">−</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" data-action="increase" data-item="${item.name}">+</button>
                        </div>
                    </div>
                `;
            });
            cartDrawerBody.innerHTML = itemsHTML;
            
            // Add event listeners to quantity buttons
            const qtyBtns = cartDrawerBody.querySelectorAll('.qty-btn');
            qtyBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;
                    const itemName = btn.dataset.item;
                    if (action === 'increase') {
                        updateQuantity(itemName, 1);
                    } else {
                        updateQuantity(itemName, -1);
                    }
                });
            });
            
            // Update subtotal
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartSubtotal.textContent = `R${subtotal}`;
            cartDrawerFooter.style.display = 'block';
        }
    }
    
    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
        }
    });
    
    // ============================================
    // SCROLL BEHAVIOR FOR STICKY NAV
    // ============================================
    
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // ============================================
    // FOOTER CATEGORY LINKS
    // ============================================
    
    const footerCategoryLinks = document.querySelectorAll('.footer-links a[data-category]');
    footerCategoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            
            // Update category
            categoryBtns.forEach(btn => {
                if (btn.dataset.category === category) {
                    btn.click();
                }
            });
            
            // Scroll to products
            document.querySelector('.winery-content').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
});
