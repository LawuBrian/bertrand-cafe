/**
 * Bertrand Cafe - Interactive Scripts
 * A Maximalist Parisian Vogue Experience
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initExploreMenu();
    initSearchOverlay();
    initHeroSlider();
    initWaitlistModal();
    initLoginModal();
    initScrollAnimations();
    initSmoothScroll();
    initDiagonalBanners();
    initEditorialKinetic();
    initEventCards();
    initSpecialsCarousel();
    initCart();
    initEventsNavigation();
});

/**
 * Navbar - Scroll Effects & State
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    const handleScroll = () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class for background
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    };

    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Explore Menu - Toggle & Navigation
 */
function initExploreMenu() {
    const exploreToggle = document.getElementById('exploreToggle');
    const exploreMenu = document.getElementById('exploreMenu');
    const searchOverlay = document.getElementById('searchOverlay');

    console.log('Explore menu init:', { exploreToggle, exploreMenu });

    if (!exploreToggle || !exploreMenu) return;

    // Toggle function
    const toggleMenu = (e) => {
        console.log('Explore button clicked/touched!');
        e.preventDefault();
        e.stopPropagation();

        // Close search if open
        if (searchOverlay) searchOverlay.classList.remove('active');

        // Toggle explore menu
        exploreMenu.classList.toggle('active');
        console.log('Menu active state:', exploreMenu.classList.contains('active'));
    };

    // Add both click and touch events for better mobile support
    exploreToggle.addEventListener('click', toggleMenu);
    exploreToggle.addEventListener('touchend', (e) => {
        e.preventDefault();
        toggleMenu(e);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!exploreToggle.contains(e.target) && !exploreMenu.contains(e.target)) {
            exploreMenu.classList.remove('active');
        }
    });

    // Close on link click
    exploreMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            exploreMenu.classList.remove('active');
        });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            exploreMenu.classList.remove('active');
        }
    });
}

/**
 * Search Overlay - Toggle & Focus
 */
function initSearchOverlay() {
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');
    const exploreMenu = document.getElementById('exploreMenu');

    if (!searchToggle || !searchOverlay) return;

    searchToggle.addEventListener('click', () => {
        // Close explore menu if open
        if (exploreMenu) exploreMenu.classList.remove('active');

        // Toggle search overlay
        searchOverlay.classList.toggle('active');

        // Focus input
        if (searchOverlay.classList.contains('active') && searchInput) {
            setTimeout(() => searchInput.focus(), 300);
        }
    });

    // Close button
    if (searchClose) {
        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
    }

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchOverlay.classList.remove('active');
        }
    });
}

/**
 * Hero Slider - Dynamic Background Images
 * Auto-advances every 3 seconds: hero-1 → hero-2 → hero-3 → hero-4 → repeat
 */
function initHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    let current = 0;

    // Make sure first slide is active
    slides[0].classList.add('active');

    // Change slide every 3 seconds
    setInterval(() => {
        // Remove active from current
        slides[current].classList.remove('active');

        // Move to next slide (0 → 1 → 2 → 3 → 0...)
        current = (current + 1) % slides.length;

        // Add active to new current
        slides[current].classList.add('active');
    }, 3000);
}

/**
 * Waitlist Modal - Open/Close & Form Handling
 */
function initWaitlistModal() {
    const waitlistModal = document.getElementById('waitlistModal');
    const successModal = document.getElementById('successModal');
    const waitlistForm = document.getElementById('waitlistForm');
    const openButtons = document.querySelectorAll('[data-open-waitlist]');
    const closeButtons = document.querySelectorAll('.modal-close');
    const continueButtons = document.querySelectorAll('[data-close-modal]');

    // Open waitlist modal
    openButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // Close any open menus
            document.getElementById('exploreMenu')?.classList.remove('active');
            document.getElementById('searchOverlay')?.classList.remove('active');
            openModal(waitlistModal);
        });
    });

    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeAllModals();
        });
    });

    // Continue buttons
    continueButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeAllModals();
        });
    });

    // Close on overlay click
    [waitlistModal, successModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeAllModals();
                }
            });
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Form submission
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmission(waitlistForm, waitlistModal, successModal);
        });
    }
}

/**
 * Open a modal
 */
function openModal(modal) {
    if (!modal) return;
    document.body.style.overflow = 'hidden';
    modal.classList.add('active');

    // Focus first input
    const firstInput = modal.querySelector('input');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 300);
    }
}

/**
 * Close all modals
 */
function closeAllModals() {
    document.body.style.overflow = '';
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
    });
}

/**
 * Handle form submission
 */
function handleFormSubmission(form, waitlistModal, successModal) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Simulate API call (replace with actual endpoint)
    console.log('Waitlist submission:', data);

    // Store in localStorage for demo purposes
    const waitlist = JSON.parse(localStorage.getItem('bertrand_waitlist') || '[]');
    waitlist.push({
        ...data,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('bertrand_waitlist', JSON.stringify(waitlist));

    // Show success modal
    closeAllModals();
    setTimeout(() => {
        openModal(successModal);
        form.reset();
    }, 300);
}

/**
 * Scroll Animations - Intersection Observer
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.concept-card, .rhythm-card, .diagonal-banner');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroContent = document.querySelector('.hero-content');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
            }
        });
    }
}

/**
 * Editorial Kinetic Typography - Scroll-linked headline animation
 */
function initEditorialKinetic() {
    const headline = document.querySelector('.kinetic-headline');
    if (!headline) return;

    const words = headline.querySelectorAll('.kinetic-word');
    const totalWords = words.length;
    if (totalWords === 0) return;

    let ticking = false;

    function updateHeadline() {
        const headlineRect = headline.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate when headline enters viewport
        const headlineTop = headlineRect.top;
        const headlineCenter = headlineTop + (headlineRect.height / 2);

        // Progress: 0 = headline at bottom of viewport, 1 = headline at top
        // Start animating when headline is 80% up from bottom
        const startPoint = viewportHeight * 0.85;
        const endPoint = viewportHeight * 0.3;

        let progress = 0;
        if (headlineCenter < startPoint) {
            progress = Math.min(1, Math.max(0, (startPoint - headlineCenter) / (startPoint - endPoint)));
        }

        // Light up words based on progress
        const litWordCount = Math.floor(progress * totalWords);
        const partialProgress = (progress * totalWords) % 1;

        words.forEach((word, index) => {
            word.classList.remove('lit', 'partial');

            if (index < litWordCount) {
                word.classList.add('lit');
            } else if (index === litWordCount && partialProgress > 0.2) {
                word.classList.add('partial');
            }
        });

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHeadline();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateHeadline();
}

/**
 * Diagonal Banners - Subtle Parallax Effect
 */
function initDiagonalBanners() {
    const banners = document.querySelectorAll('.diagonal-banner');

    banners.forEach(banner => {
        const bg = banner.querySelector('.banner-bg');

        // Subtle parallax on mouse move - background only
        banner.addEventListener('mousemove', (e) => {
            const rect = banner.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate percentage position (-1 to 1)
            const xPercent = (x / rect.width - 0.5) * 2;
            const yPercent = (y / rect.height - 0.5) * 2;

            // Apply subtle parallax to background
            if (bg) {
                bg.style.transform = `scale(1.05) translate(${xPercent * -5}px, ${yPercent * -3}px)`;
            }
        });

        // Reset on mouse leave
        banner.addEventListener('mouseleave', () => {
            if (bg) {
                bg.style.transform = '';
            }
        });
    });
}

/**
 * Smooth Scroll - Navigation Links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                // Close any open menus
                document.getElementById('exploreMenu')?.classList.remove('active');
                document.getElementById('searchOverlay')?.classList.remove('active');

                // Scroll to target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Utility - Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility - Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Add subtle hover effects to cards and editorial grid
 */
document.querySelectorAll('.concept-card, .rhythm-card, .editorial-grid').forEach(element => {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        element.style.setProperty('--mouse-x', `${x}px`);
        element.style.setProperty('--mouse-y', `${y}px`);
    });
});

/**
 * Cart functionality (placeholder)
 */
/**
 * Cart Functionality
 */
let cart = [];

function initCart() {
    // Cart Elements
    const cartDrawerClose = document.getElementById('cartDrawerClose');
    const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
    const cartToggle = document.querySelector('.nav-cart');
    const addToCartBtns = document.querySelectorAll('.btn-add-cart');

    // Toggle Cart
    if (cartToggle) {
        cartToggle.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    if (cartDrawerClose) {
        cartDrawerClose.addEventListener('click', closeCart);
    }

    if (cartDrawerOverlay) {
        cartDrawerOverlay.addEventListener('click', closeCart);
    }

    // Add to Cart Buttons
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.item;
            const price = parseInt(btn.dataset.price);

            addToCart(name, price);

            // Visual Feedback
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

    // Quantity Buttons (Event Delegation)
    const cartDrawerBody = document.getElementById('cartDrawerBody');
    if (cartDrawerBody) {
        cartDrawerBody.addEventListener('click', (e) => {
            if (e.target.closest('.qty-btn')) {
                const btn = e.target.closest('.qty-btn');
                const action = btn.dataset.action;
                const name = btn.dataset.item;

                if (action === 'increase') {
                    updateQuantity(name, 1);
                } else if (action === 'decrease') {
                    updateQuantity(name, -1);
                }
            }
        });
    }
}

function openCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
    if (cartDrawer && cartDrawerOverlay) {
        cartDrawer.classList.add('open');
        cartDrawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
    if (cartDrawer && cartDrawerOverlay) {
        cartDrawer.classList.remove('open');
        cartDrawerOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

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
    openCart();
}

function updateQuantity(name, delta) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
        updateCartUI();
    }
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartDrawerBody = document.getElementById('cartDrawerBody');
    const cartDrawerFooter = document.getElementById('cartDrawerFooter');
    const cartSubtotal = document.getElementById('cartSubtotal');

    // Update Count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;

    // Update Drawer
    if (cart.length === 0) {
        if (cartDrawerBody) {
            cartDrawerBody.innerHTML = `
                <div class="cart-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M4 10c0 0 0-3 8-3s8 3 8 3" />
                        <path d="M3 10h18v2c0 5-3 9-9 9s-9-4-9-9v-2z" />
                    </svg>
                    <p>Your basket is empty</p>
                    <span>Add items from the menu to begin your order</span>
                </div>
            `;
        }
        if (cartDrawerFooter) cartDrawerFooter.style.display = 'none';
    } else {
        let itemsHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            subtotal += item.price * item.quantity;
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

        if (cartDrawerBody) cartDrawerBody.innerHTML = itemsHTML;

        if (cartSubtotal) cartSubtotal.textContent = `R${subtotal}`;
        if (cartDrawerFooter) cartDrawerFooter.style.display = 'block';
    }
}

/**
 * Event Cards - Card Click & Deck Animation
 */
function initEventCards() {
    const eventsSection = document.querySelector('.events-banner-section');
    const eventsCard = document.getElementById('eventsBanner');
    const eventsClose = document.getElementById('eventsClose');
    const eventCards = document.querySelectorAll('.event-card');

    if (!eventsSection || !eventsCard) return;

    // Add mouse tracking for glow effect on events card
    eventsCard.addEventListener('mousemove', (e) => {
        const rect = eventsCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        eventsCard.style.setProperty('--mouse-x', `${x}px`);
        eventsCard.style.setProperty('--mouse-y', `${y}px`);
    });

    // Click card to expand
    eventsCard.addEventListener('click', () => {
        eventsSection.classList.add('expanded');

        // Scroll to expanded section smoothly
        setTimeout(() => {
            const expandedSection = document.getElementById('eventsExpanded');
            if (expandedSection) {
                expandedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    });

    // Close button
    if (eventsClose) {
        eventsClose.addEventListener('click', (e) => {
            e.stopPropagation();
            eventsSection.classList.remove('expanded');

            // Scroll back to events card
            setTimeout(() => {
                eventsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        });
    }

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && eventsSection.classList.contains('expanded')) {
            eventsSection.classList.remove('expanded');
        }
    });

    // Add 3D tilt effect on individual card hover
    eventCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // Disable on mobile
            if (window.innerWidth <= 768) return;

            if (!eventsSection.classList.contains('expanded')) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;

            card.querySelector('.card-inner').style.transform =
                `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            // Disable on mobile
            if (window.innerWidth <= 768) return;

            card.querySelector('.card-inner').style.transform = '';
        });
    });

    // Mobile: Solitaire-style tap-to-spread deck
    const cardsDeck = document.getElementById('cardsDeck');
    const deckTapHint = document.getElementById('deckTapHint');

    if (cardsDeck) {
        // Check if we're on mobile
        const isMobile = () => window.innerWidth <= 768;

        // Toggle deck spread on tap (mobile only)
        cardsDeck.addEventListener('click', (e) => {
            if (!isMobile()) return;
            if (!eventsSection.classList.contains('expanded')) return;

            // Don't toggle if clicking on a card in spread state
            const clickedCard = e.target.closest('.event-card');
            if (clickedCard && cardsDeck.classList.contains('deck-spread')) {
                // Card was clicked in spread state - could add navigation here
                return;
            }

            // Toggle spread state
            cardsDeck.classList.toggle('deck-spread');
        });

        // Reset deck when section closes
        if (eventsClose) {
            const originalCloseHandler = eventsClose.onclick;
            eventsClose.addEventListener('click', () => {
                cardsDeck.classList.remove('deck-spread');
            });
        }

        // Also reset on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && eventsSection.classList.contains('expanded')) {
                cardsDeck.classList.remove('deck-spread');
            }
        });
    }
}

/**
 * Console branding
 */
/**
 * Specials Carousel - Horizontal Scroll Navigation
 */
function initSpecialsCarousel() {
    const carousel = document.getElementById('specialsCarousel');
    const prevBtn = document.querySelector('.specials-nav-prev');
    const nextBtn = document.querySelector('.specials-nav-next');

    if (!carousel) return;

    const scrollAmount = 300; // Pixels to scroll per click

    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
    }

    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    }

    // Update button visibility based on scroll position
    function updateNavButtons() {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;

        if (prevBtn) {
            prevBtn.style.opacity = carousel.scrollLeft <= 10 ? '0.3' : '1';
            prevBtn.style.pointerEvents = carousel.scrollLeft <= 10 ? 'none' : 'auto';
        }

        if (nextBtn) {
            nextBtn.style.opacity = carousel.scrollLeft >= maxScroll - 10 ? '0.3' : '1';
            nextBtn.style.pointerEvents = carousel.scrollLeft >= maxScroll - 10 ? 'none' : 'auto';
        }
    }

    // Initial check
    updateNavButtons();

    // Update on scroll
    carousel.addEventListener('scroll', updateNavButtons);

    // Update on resize
    window.addEventListener('resize', updateNavButtons);
}

console.log(
    '%c Bertrand Cafe ',
    'background: #1a1a1a; color: #c9a962; font-size: 20px; font-weight: bold; padding: 10px 20px; font-family: Georgia, serif;'
);
console.log(
    '%c The Soul of Maboneng. Reimagined. ',
    'color: #a0a0a0; font-size: 12px; font-family: -apple-system, sans-serif;'
);

/**
 * Login Modal - Toggle & Tab Switching
 */
function initLoginModal() {
    const loginToggle = document.getElementById('loginToggle');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const authTabs = document.querySelectorAll('.auth-tab');
    const modalTitle = document.getElementById('loginModalTitle');

    if (!loginToggle || !loginModal) return;

    // Open login modal
    loginToggle.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(loginModal);
    });

    // Close button
    const closeBtn = loginModal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close on overlay click
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.dataset.tab;

            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show correct form
            if (tabType === 'login') {
                loginForm.style.display = 'block';
                signupForm.style.display = 'none';
                modalTitle.textContent = 'Welcome Back';
            } else {
                loginForm.style.display = 'none';
                signupForm.style.display = 'block';
                modalTitle.textContent = 'Create Account';
            }
        });
    });

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            console.log('Login attempt:', Object.fromEntries(formData));
            alert('Login functionality coming soon!');
        });
    }

    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(signupForm);
            console.log('Signup attempt:', Object.fromEntries(formData));
            alert('Account created! (Demo)');
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

/**
 * Events Navigation - Auto-open cards when clicking Events link
 */
function initEventsNavigation() {
    const eventsLinks = document.querySelectorAll('a[href="#events"]');
    const eventsSection = document.querySelector('.events-banner-section');
    const eventsCard = document.getElementById('eventsBanner');

    eventsLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Close any open menus
            document.getElementById('exploreMenu')?.classList.remove('active');

            // Scroll to events section
            if (eventsSection) {
                eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // After scrolling, auto-expand the events card
                setTimeout(() => {
                    if (eventsCard && !eventsSection.classList.contains('expanded')) {
                        eventsCard.click();
                    }
                }, 800);
            }
        });
    });
}
