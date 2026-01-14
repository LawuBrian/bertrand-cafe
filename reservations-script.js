/* ============================================
   RESERVATIONS PAGE - JAVASCRIPT
   Luxury Lounge Booking Engine
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    // ============================================
    // LOUNGE DATA
    // ============================================
    const loungeData = {
        cigar: {
            name: 'The Cigar Lounge',
            tag: 'Exclusive',
            description: 'An intimate escape of smoke & whisky',
            rate: 850
        },
        wine: {
            name: 'The Wine Lounge',
            tag: 'Social',
            description: 'Curated vintages for meaningful moments',
            rate: 650
        },
        salon: {
            name: 'Salon de Thé',
            tag: 'Refined',
            description: 'Where time slows for tea & conversation',
            rate: 550
        },
        cafeteria: {
            name: 'The Cafeteria',
            tag: 'Casual',
            description: 'The sunlit heart of Bertrand',
            rate: 400
        },
        jazz: {
            name: 'The Jazz Lounge',
            tag: 'Signature',
            description: 'Live music & velvet nights',
            rate: 900
        }
    };

    const BUFFET_PRICE_PER_GUEST = 350;

    // ============================================
    // STATE
    // ============================================
    let currentLounge = null;
    let selectedDuration = 1;
    let guestCount = 2;

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const bookingOverlay = document.getElementById('bookingOverlay');
    const bookingPanel = document.getElementById('bookingPanel');
    const bookingClose = document.getElementById('bookingClose');
    const bookingForm = document.getElementById('bookingForm');

    const bookingLoungeTag = document.getElementById('bookingLoungeTag');
    const bookingLoungeName = document.getElementById('bookingLoungeName');
    const bookingLoungeDesc = document.getElementById('bookingLoungeDesc');

    const bookingDate = document.getElementById('bookingDate');
    const bookingTime = document.getElementById('bookingTime');
    const durationBtns = document.querySelectorAll('.duration-btn');
    const guestCountInput = document.getElementById('guestCount');
    const counterBtns = document.querySelectorAll('.counter-btn');
    const includeBuffet = document.getElementById('includeBuffet');
    const specialRequests = document.getElementById('specialRequests');

    const loungeCalc = document.getElementById('loungeCalc');
    const loungePrice = document.getElementById('loungePrice');
    const buffetRow = document.getElementById('buffetRow');
    const buffetCalc = document.getElementById('buffetCalc');
    const buffetPrice = document.getElementById('buffetPrice');
    const totalPrice = document.getElementById('totalPrice');

    const successOverlay = document.getElementById('successOverlay');
    const successSummary = document.getElementById('successSummary');
    const successClose = document.getElementById('successClose');

    const bookingsOverlay = document.getElementById('bookingsOverlay');
    const bookingsPanel = document.getElementById('bookingsPanel');
    const bookingsClose = document.getElementById('bookingsClose');
    const bookingsList = document.getElementById('bookingsList');
    const bookingsEmpty = document.getElementById('bookingsEmpty');
    const bookingsCount = document.getElementById('bookingsCount');
    const myBookingsToggle = document.getElementById('myBookingsToggle');

    // ============================================
    // INITIALIZE
    // ============================================
    function init() {
        setMinDate();
        attachEventListeners();
        updateBookingsCount();
    }

    function setMinDate() {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        bookingDate.min = `${yyyy}-${mm}-${dd}`;
        bookingDate.value = `${yyyy}-${mm}-${dd}`;
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    function attachEventListeners() {
        // Lounge selection
        document.querySelectorAll('[data-select-lounge]').forEach(btn => {
            btn.addEventListener('click', handleLoungeSelect);
        });

        // Close booking panel
        bookingClose.addEventListener('click', closeBookingPanel);
        bookingOverlay.addEventListener('click', (e) => {
            if (e.target === bookingOverlay) closeBookingPanel();
        });

        // Duration selection
        durationBtns.forEach(btn => {
            btn.addEventListener('click', handleDurationSelect);
        });

        // Guest counter
        counterBtns.forEach(btn => {
            btn.addEventListener('click', handleGuestCount);
        });

        // Buffet toggle
        includeBuffet.addEventListener('change', updatePricing);

        // Form submission
        bookingForm.addEventListener('submit', handleBookingSubmit);

        // Success modal close
        successClose.addEventListener('click', closeSuccessModal);
        successOverlay.addEventListener('click', (e) => {
            if (e.target === successOverlay) closeSuccessModal();
        });

        // My Bookings
        myBookingsToggle.addEventListener('click', openBookingsPanel);
        bookingsClose.addEventListener('click', closeBookingsPanel);
        bookingsOverlay.addEventListener('click', (e) => {
            if (e.target === bookingsOverlay) closeBookingsPanel();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (successOverlay.classList.contains('active')) {
                    closeSuccessModal();
                } else if (bookingOverlay.classList.contains('active')) {
                    closeBookingPanel();
                } else if (bookingsOverlay.classList.contains('active')) {
                    closeBookingsPanel();
                }
            }
        });
    }

    // ============================================
    // LOUNGE SELECTION
    // ============================================
    function handleLoungeSelect(e) {
        const card = e.target.closest('.lounge-card');
        const loungeKey = card.dataset.lounge;
        currentLounge = loungeData[loungeKey];
        currentLounge.key = loungeKey;

        // Update booking panel header
        bookingLoungeTag.textContent = currentLounge.tag;
        bookingLoungeName.textContent = currentLounge.name;
        bookingLoungeDesc.textContent = currentLounge.description;

        // Reset form
        selectedDuration = 1;
        guestCount = 2;
        guestCountInput.value = 2;
        includeBuffet.checked = false;
        specialRequests.value = '';

        // Reset duration buttons
        durationBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.duration === '1');
        });

        // Update pricing
        updatePricing();

        // Open panel
        openBookingPanel();
    }

    function openBookingPanel() {
        bookingOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeBookingPanel() {
        bookingOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ============================================
    // DURATION SELECTION
    // ============================================
    function handleDurationSelect(e) {
        durationBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        selectedDuration = parseInt(e.target.dataset.duration);
        updatePricing();
    }

    // ============================================
    // GUEST COUNT
    // ============================================
    function handleGuestCount(e) {
        const action = e.target.dataset.action;
        if (action === 'increase' && guestCount < 20) {
            guestCount++;
        } else if (action === 'decrease' && guestCount > 1) {
            guestCount--;
        }
        guestCountInput.value = guestCount;
        updatePricing();
    }

    // ============================================
    // PRICING ENGINE
    // ============================================
    function updatePricing() {
        if (!currentLounge) return;

        // Lounge price
        const loungeTotalPrice = currentLounge.rate * selectedDuration;
        const durationText = selectedDuration === 1 ? '1 hour' : `${selectedDuration} hours`;
        loungeCalc.textContent = `R${currentLounge.rate} × ${durationText}`;
        loungePrice.textContent = formatPrice(loungeTotalPrice);

        // Buffet price
        let buffetTotalPrice = 0;
        if (includeBuffet.checked) {
            buffetTotalPrice = guestCount * BUFFET_PRICE_PER_GUEST;
            buffetCalc.textContent = `${guestCount} guests × R${BUFFET_PRICE_PER_GUEST}`;
            buffetPrice.textContent = formatPrice(buffetTotalPrice);
            buffetRow.style.display = 'flex';
        } else {
            buffetRow.style.display = 'none';
        }

        // Total
        const total = loungeTotalPrice + buffetTotalPrice;
        totalPrice.textContent = formatPrice(total);
    }

    function formatPrice(amount) {
        return `R${amount.toLocaleString()}`;
    }

    // ============================================
    // BOOKING SUBMISSION
    // ============================================
    function handleBookingSubmit(e) {
        e.preventDefault();

        if (!validateForm()) return;

        const booking = createBooking();
        saveBooking(booking);
        showSuccessModal(booking);
        closeBookingPanel();
        updateBookingsCount();
    }

    function validateForm() {
        if (!bookingDate.value) {
            alert('Please select a date');
            return false;
        }
        if (!bookingTime.value) {
            alert('Please select a time');
            return false;
        }
        return true;
    }

    function createBooking() {
        const loungeTotal = currentLounge.rate * selectedDuration;
        const buffetTotal = includeBuffet.checked ? guestCount * BUFFET_PRICE_PER_GUEST : 0;

        return {
            id: generateId(),
            lounge: currentLounge.name,
            loungeKey: currentLounge.key,
            date: bookingDate.value,
            time: bookingTime.value,
            duration: selectedDuration,
            guestCount: guestCount,
            includeBuffet: includeBuffet.checked,
            specialRequests: specialRequests.value,
            loungePrice: loungeTotal,
            buffetPrice: buffetTotal,
            totalPrice: loungeTotal + buffetTotal,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };
    }

    function generateId() {
        return 'bk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // ============================================
    // LOCAL STORAGE
    // ============================================
    function saveBooking(booking) {
        const bookings = getBookings();
        bookings.unshift(booking);
        localStorage.setItem('bertrand_bookings', JSON.stringify(bookings));
    }

    function getBookings() {
        const stored = localStorage.getItem('bertrand_bookings');
        return stored ? JSON.parse(stored) : [];
    }

    function updateBookingsCount() {
        const bookings = getBookings();
        const pendingCount = bookings.filter(b => b.status === 'Pending').length;
        bookingsCount.textContent = pendingCount;
        bookingsCount.dataset.count = pendingCount;
    }

    // ============================================
    // SUCCESS MODAL
    // ============================================
    function showSuccessModal(booking) {
        const formattedDate = formatDate(booking.date);
        const durationText = booking.duration === 1 ? '1 hour' : `${booking.duration} hours`;

        successSummary.innerHTML = `
            <p>Lounge <span>${booking.lounge}</span></p>
            <p>Date <span>${formattedDate}</span></p>
            <p>Time <span>${booking.time}</span></p>
            <p>Duration <span>${durationText}</span></p>
            <p>Guests <span>${booking.guestCount}</span></p>
            ${booking.includeBuffet ? `<p>Buffet <span>Included</span></p>` : ''}
            <p>Total <span>${formatPrice(booking.totalPrice)}</span></p>
        `;

        successOverlay.classList.add('active');
    }

    function closeSuccessModal() {
        successOverlay.classList.remove('active');
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-ZA', options);
    }

    // ============================================
    // MY BOOKINGS PANEL
    // ============================================
    function openBookingsPanel() {
        renderBookings();
        bookingsOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeBookingsPanel() {
        bookingsOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function renderBookings() {
        const bookings = getBookings();

        if (bookings.length === 0) {
            bookingsEmpty.style.display = 'block';
            return;
        }

        bookingsEmpty.style.display = 'none';

        // Remove existing booking items (but keep empty state)
        const existingItems = bookingsList.querySelectorAll('.booking-item');
        existingItems.forEach(item => item.remove());

        bookings.forEach(booking => {
            const item = createBookingItem(booking);
            bookingsList.appendChild(item);
        });
    }

    function createBookingItem(booking) {
        const div = document.createElement('div');
        div.className = 'booking-item';

        const formattedDate = formatDate(booking.date);
        const durationText = booking.duration === 1 ? '1hr' : `${booking.duration}hrs`;
        const statusClass = booking.status.toLowerCase();

        div.innerHTML = `
            <div class="booking-item-header">
                <span class="booking-item-lounge">${booking.lounge}</span>
                <span class="booking-item-status ${statusClass}">${booking.status}</span>
            </div>
            <div class="booking-item-details">
                <span>📅 ${formattedDate}</span>
                <span>🕐 ${booking.time}</span>
                <span>⏱ ${durationText}</span>
                <span>👥 ${booking.guestCount} guests</span>
                ${booking.includeBuffet ? '<span>🍽 Buffet</span>' : ''}
            </div>
            <div class="booking-item-price">${formatPrice(booking.totalPrice)}</div>
        `;

        return div;
    }

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ============================================
    // INITIALIZE APP
    // ============================================
    init();
});
