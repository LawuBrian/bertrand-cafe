/**
 * Bertrand Cafe - Menu Page Scripts
 * Uber Eats Inspired Delivery Menu Experience
 */

document.addEventListener('DOMContentLoaded', () => {
    initCategoryFilter();
    initAddToCart();
    initCartDrawer();
    initStickyCategories();
    initCardAnimations();
});

/**
 * Category Filter - Smooth filtering of menu items
 */
function initCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuGrid = document.getElementById('menuGrid');

    if (!categoryBtns.length || !menuGrid) return;

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;

            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Get all menu cards
            const menuCards = Array.from(menuGrid.querySelectorAll('.menu-card'));

            // Separate visible and hidden cards
            const visibleCards = [];
            const hiddenCards = [];

            menuCards.forEach(card => {
                const cardCategory = card.dataset.category;
                
                if (category === 'all' || cardCategory === category) {
                    visibleCards.push(card);
                } else {
                    hiddenCards.push(card);
                }
            });

            // Reorder: visible cards first, then hidden cards
            // This ensures visible items stay together from the top
            visibleCards.forEach((card, index) => {
                card.classList.remove('hidden');
                card.classList.add('visible');
                card.style.order = index;
                menuGrid.appendChild(card);
            });

            hiddenCards.forEach((card, index) => {
                card.classList.add('hidden');
                card.classList.remove('visible');
                card.style.order = visibleCards.length + index;
            });

            // Scroll to top of menu grid
            const offset = 150; // Account for sticky nav
            const topPosition = menuGrid.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: topPosition, behavior: 'smooth' });
        });
    });
}

/**
 * Add to Cart - Handle add button clicks
 */
let cart = [];

function initAddToCart() {
    const addButtons = document.querySelectorAll('.btn-add-cart');

    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const itemName = btn.dataset.item;
            const itemPrice = parseFloat(btn.dataset.price);

            // Check if item already in cart
            const existingItem = cart.find(item => item.name === itemName);

            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({
                    name: itemName,
                    price: itemPrice,
                    qty: 1
                });
            }

            // Button feedback animation
            btn.classList.add('added');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Added!</span>
            `;

            setTimeout(() => {
                btn.classList.remove('added');
                btn.innerHTML = originalHTML;
            }, 1500);

            // Update cart UI
            updateCartUI();

            // Open cart drawer briefly
            openCartDrawer();
            setTimeout(closeCartDrawer, 2000);
        });
    });
}

/**
 * Cart Drawer - Open/Close and Update
 */
function initCartDrawer() {
    const cartToggle = document.getElementById('menuCartToggle');
    const cartClose = document.getElementById('cartDrawerClose');
    const cartOverlay = document.getElementById('cartDrawerOverlay');

    if (cartToggle) {
        cartToggle.addEventListener('click', openCartDrawer);
    }

    if (cartClose) {
        cartClose.addEventListener('click', closeCartDrawer);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartDrawer);
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCartDrawer();
        }
    });
}

function openCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartDrawerOverlay');

    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartDrawerOverlay');

    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
}

function updateCartUI() {
    const cartCount = document.getElementById('menuCartCount');
    const cartBody = document.getElementById('cartDrawerBody');
    const cartFooter = document.getElementById('cartDrawerFooter');
    const cartSubtotal = document.getElementById('cartSubtotal');

    // Update cart count badge
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;

        // Bounce animation
        cartCount.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 200);
    }

    // Update cart body
    if (cartBody) {
        if (cart.length === 0) {
            cartBody.innerHTML = `
                <div class="cart-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M4 10c0 0 0-3 8-3s8 3 8 3" />
                        <path d="M3 10h18v2c0 5-3 9-9 9s-9-4-9-9v-2z" />
                    </svg>
                    <p>Your basket is empty</p>
                    <span>Add items from the menu to begin your order</span>
                </div>
            `;
            if (cartFooter) cartFooter.style.display = 'none';
        } else {
            cartBody.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">R${item.price}</div>
                    </div>
                    <div class="cart-item-qty">
                        <button onclick="updateQty('${item.name}', -1)">−</button>
                        <span>${item.qty}</span>
                        <button onclick="updateQty('${item.name}', 1)">+</button>
                    </div>
                </div>
            `).join('');

            if (cartFooter) cartFooter.style.display = 'block';

            // Calculate subtotal
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
            if (cartSubtotal) cartSubtotal.textContent = `R${subtotal}`;
        }
    }
}

// Global function for quantity updates
window.updateQty = function (itemName, delta) {
    const item = cart.find(i => i.name === itemName);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.name !== itemName);
        }
        updateCartUI();
    }
};

/**
 * Sticky Categories - Update active on scroll
 */
function initStickyCategories() {
    const categories = document.getElementById('menuCategories');
    const menuGrid = document.getElementById('menuGrid');

    if (!categories || !menuGrid) return;

    // Add shadow when sticky
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (!entry.isIntersecting) {
                categories.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
            } else {
                categories.style.boxShadow = 'none';
            }
        },
        { rootMargin: '-80px 0px 0px 0px' }
    );

    observer.observe(menuGrid);
}

/**
 * Card Animations - Intersection Observer for entry animations
 */
function initCardAnimations() {
    const cards = document.querySelectorAll('.menu-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach(card => observer.observe(card));
}

/**
 * Search functionality (placeholder)
 */
function initMenuSearch() {
    const searchToggle = document.getElementById('menuSearchToggle');

    if (searchToggle) {
        searchToggle.addEventListener('click', () => {
            // Future: implement search overlay for menu items
            console.log('Search clicked - feature coming soon');
        });
    }
}

// Console branding
console.log(
    '%c Bertrand Cafe Menu ',
    'background: #1a1a1a; color: #c9a962; font-size: 16px; font-weight: bold; padding: 8px 16px; font-family: Georgia, serif;'
);
console.log(
    '%c Culinary Artistry Delivered ',
    'color: #a0a0a0; font-size: 11px; font-family: -apple-system, sans-serif;'
);
