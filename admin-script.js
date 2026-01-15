/**
 * Bertrand Admin - Mock CMS Script
 * Uses localStorage for data persistence
 */

// ============================================
// AUTHENTICATION
// ============================================
const ADMIN_CREDENTIALS = {
    username: 'admin123',
    password: 'admin123'
};
const AUTH_KEY = 'bertrand_admin_auth';

// ============================================
// DATA STORE
// ============================================
const STORAGE_KEY = 'bertrand_cms_data';

// Default data structure - matches demo site content
const defaultData = {
    events: [
        { id: 1, order: 1, name: 'Wine & Jazz Evening', category: 'Music', description: 'Live jazz with premium wine selections every Friday', image: 'images/event-jazz.jpg' },
        { id: 2, order: 2, name: 'Poetry Brunch', category: 'Literary', description: 'Sunday poetry readings with gourmet brunch menu', image: 'images/event-poetry.jpg' },
        { id: 3, order: 3, name: 'Vinyl Sundays', category: 'Music', description: 'Classic vinyl sessions with signature cocktails', image: 'images/event-vinyl.jpg' }
    ],
    menu: [
        { id: 1, order: 1, name: 'Green Power Breakfast Bowl', category: 'BOWLS', price: 118, description: 'Scrambled eggs, smashed avocado, roasted sweet potato cubes, sautéed spinach, chili crunch & herb seeds', badge: 'SIGNATURE', image: 'images/PHOTO-2026-01-09-19-40-51 3.jpg' },
        { id: 2, order: 2, name: 'Triple Melt Croque', category: 'TOASTIES', price: 95, description: 'Toasted sourdough stacked with smoked ham, melted cheese & herb butter', badge: 'CAFÉ CLASSIC', image: 'images/PHOTO-2026-01-09-19-40-51 2.jpg' },
        { id: 3, order: 3, name: 'Classic Garden Breakfast', category: 'MAINS', price: 105, description: 'Fluffy scrambled eggs, toasted artisan bread, grilled zucchini & peppers, fresh avocado', badge: '', image: 'images/PHOTO-2026-01-09-19-40-51 5.jpg' },
        { id: 4, order: 4, name: 'Sunrise Mediterranean Bowl', category: 'SALADS', price: 92, description: 'Free-range fried egg over cucumber, cherry tomato, herbs & olive oil crunch', badge: 'FRESH', image: 'images/PHOTO-2026-01-09-19-40-51 4.jpg' },
        { id: 5, order: 5, name: 'Two-Egg Urban Hash', category: 'MAINS', price: 110, description: 'Crispy breakfast potatoes, grilled peppers, two sunny-side eggs & sliced avocado', badge: '', image: 'images/PHOTO-2026-01-09-19-40-51 6 (1).jpg' },
        { id: 6, order: 6, name: 'French Country Quiche', category: 'PASTRY', price: 78, description: 'Flaky pastry filled with egg custard, zucchini, smoked bacon & herbs', badge: 'CAFÉ CLASSIC', image: 'images/PHOTO-2026-01-09-19-40-51 7.jpg' },
        { id: 7, order: 7, name: 'Breakfast Skillet Pizza', category: 'SKILLETS', price: 115, description: 'Egg-based base topped with tomato, mozzarella, basil & fresh greens', badge: 'SIGNATURE', image: 'images/PHOTO-2026-01-09-19-40-51.jpg' }
    ],
    winery: [
        { id: 1, order: 1, name: 'Château Margaux 2018', type: 'Red', year: '2018', price: 2500, description: 'Full-bodied Bordeaux blend with notes of blackcurrant and cedar', image: '' },
        { id: 2, order: 2, name: 'Cloudy Bay Sauvignon Blanc', type: 'White', year: '2022', price: 650, description: 'Crisp New Zealand white with tropical fruit notes', image: '' },
        { id: 3, order: 3, name: 'Moët & Chandon Impérial', type: 'Champagne', year: 'NV', price: 1200, description: 'Classic French champagne with fine bubbles', image: '' },
        { id: 4, order: 4, name: 'Stellenbosch Pinotage Reserve', type: 'Red', year: '2020', price: 450, description: 'South African specialty with smoky, earthy tones', image: '' },
        { id: 5, order: 5, name: 'Meerlust Rubicon', type: 'Red', year: '2019', price: 850, description: 'Premium Bordeaux-style blend from Stellenbosch', image: '' }
    ],
    lounges: [
        { id: 1, name: 'The Jazz Room', capacity: 12, hourlyRate: 800, minHours: 2, status: 'available', description: 'Intimate setting with vintage vinyl and leather seating', image: '' },
        { id: 2, name: 'Poetry Corner', capacity: 8, hourlyRate: 600, minHours: 2, status: 'available', description: 'Cozy literary nook with floor-to-ceiling bookshelves', image: '' },
        { id: 3, name: 'The Terrace', capacity: 20, hourlyRate: 1200, minHours: 3, status: 'available', description: 'Open-air rooftop with city views and lounge seating', image: '' },
        { id: 4, name: 'Wine Cellar', capacity: 15, hourlyRate: 1000, minHours: 2, status: 'maintenance', description: 'Underground vault with premium wine collection', image: '' }
    ],
    loungeSettings: {
        deposit: 500,
        cancelFee: 25,
        advanceBooking: 14,
        openTime: '10:00',
        closeTime: '23:00',
        slotDuration: 2
    },
    images: [
        { id: 1, name: 'hero-slide-1.jpg', url: 'images/hero-slide-1.jpg', section: 'hero' },
        { id: 2, name: 'hero-slide-2.jpg', url: 'images/hero-slide-2.jpg', section: 'hero' },
        { id: 3, name: 'hero-slide-3.jpg', url: 'images/hero-slide-3.jpg', section: 'hero' },
        { id: 4, name: 'banner-bg.jpg', url: 'images/banner-bg.jpg', section: 'banner' }
    ],
    settings: {
        siteName: 'Bertrand Cafe',
        tagline: 'The Soul of Maboneng. Reimagined.',
        phone: '+27 12 345 6789',
        email: 'hello@bertrandcafe.co.za',
        instagram: 'https://instagram.com/bertrandcafe',
        facebook: 'https://facebook.com/bertrandcafe',
        tiktok: 'https://tiktok.com/@bertrandcafe',
        addressStreet: '296 Fox Street',
        addressArea: 'Maboneng, Johannesburg',
        addressCountry: 'South Africa'
    }
};

// Load data from localStorage or use defaults
function loadData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const data = JSON.parse(stored);
            // Ensure lounges exist (migration from old structure)
            if (!data.lounges) data.lounges = defaultData.lounges;
            if (!data.loungeSettings) data.loungeSettings = defaultData.loungeSettings;
            return data;
        } catch (e) {
            console.error('Error parsing stored data:', e);
            return { ...defaultData };
        }
    }
    return { ...defaultData };
}

// Save data to localStorage
function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Global data object
let cmsData = loadData();

// ============================================
// DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
});

// ============================================
// AUTHENTICATION
// ============================================
function initAuth() {
    const loginScreen = document.getElementById('loginScreen');
    const loginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');

    // Check if already logged in
    if (sessionStorage.getItem(AUTH_KEY) === 'true') {
        showDashboard();
        return;
    }

    // Login form handler
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            sessionStorage.setItem(AUTH_KEY, 'true');
            loginError.style.display = 'none';
            showDashboard();
        } else {
            loginError.style.display = 'block';
            document.getElementById('adminPassword').value = '';
        }
    });

    // Logout handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem(AUTH_KEY);
            window.location.reload();
        });
    }
}

function showDashboard() {
    document.getElementById('loginScreen').classList.add('hidden');
    initApp();
}

function initApp() {
    initSidebar();
    initNavigation();
    initDashboard();
    initEvents();
    initMenu();
    initWinery();
    initLounges();
    initImages();
    initSettings();
    initModals();
    initExportImport();
    updateStats();
}
function initSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const sidebarToggle = document.getElementById('sidebarToggle');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.admin-section');
    const pageTitle = document.getElementById('pageTitle');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.dataset.section;

            // Update active nav
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(`section-${sectionId}`).classList.add('active');

            // Update page title
            pageTitle.textContent = item.querySelector('span').textContent;

            // Close mobile sidebar
            document.getElementById('adminSidebar').classList.remove('open');
        });
    });

    // Quick action buttons
    document.querySelectorAll('[data-goto]').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.goto;
            document.querySelector(`.nav-item[data-section="${section}"]`).click();
        });
    });
}

// ============================================
// DASHBOARD
// ============================================
function initDashboard() {
    updateStats();
}

function updateStats() {
    document.getElementById('statEvents').textContent = cmsData.events.length;
    document.getElementById('statMenu').textContent = cmsData.menu.length;
    document.getElementById('statWinery').textContent = cmsData.winery.length;
    document.getElementById('statLounges').textContent = cmsData.lounges.length;
}

// ============================================
// EVENTS MANAGEMENT
// ============================================
function initEvents() {
    renderEventsTable();

    document.getElementById('addEvent').addEventListener('click', () => {
        openEditModal('event', null);
    });
}

function renderEventsTable() {
    const tbody = document.getElementById('eventsTableBody');
    tbody.innerHTML = '';

    cmsData.events.sort((a, b) => a.order - b.order).forEach(event => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <button class="btn-move" data-id="${event.id}" title="Drag to reorder">⋮⋮</button>
            </td>
            <td>${event.name}</td>
            <td><span class="category-badge">${event.category}</span></td>
            <td class="desc-cell">${event.description}</td>
            <td>
                <div class="table-image-preview">
                    <img src="${event.image}" alt="${event.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2240%22><rect fill=%22%231a1a1a%22 width=%2260%22 height=%2240%22/><text fill=%22%23555%22 x=%2230%22 y=%2224%22 font-size=%228%22 text-anchor=%22middle%22>No img</text></svg>'">
                </div>
            </td>
            <td class="table-actions">
                <button class="btn-edit" data-type="event" data-id="${event.id}">Edit</button>
                <button class="btn-delete" data-type="event" data-id="${event.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    attachTableActions('event');
}

// ============================================
// MENU MANAGEMENT
// ============================================
function initMenu() {
    renderMenuTable();

    document.getElementById('addMenuItem').addEventListener('click', () => {
        openEditModal('menu', null);
    });
}

function renderMenuTable() {
    const tbody = document.getElementById('menuTableBody');
    tbody.innerHTML = '';

    cmsData.menu.sort((a, b) => a.order - b.order).forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <button class="btn-move" data-id="${item.id}" title="Drag to reorder">⋮⋮</button>
            </td>
            <td>
                <div class="item-with-image">
                    <div class="table-image-preview">
                        <img src="${item.image || ''}" alt="${item.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2240%22><rect fill=%22%231a1a1a%22 width=%2260%22 height=%2240%22/><text fill=%22%23555%22 x=%2230%22 y=%2224%22 font-size=%228%22 text-anchor=%22middle%22>No img</text></svg>'">
                    </div>
                    <span>${item.name}</span>
                </div>
            </td>
            <td><span class="category-badge">${item.category}</span></td>
            <td class="price-cell">R${item.price}</td>
            <td class="desc-cell">${item.description}</td>
            <td>${item.badge ? `<span class="badge-tag">${item.badge}</span>` : '—'}</td>
            <td class="table-actions">
                <button class="btn-edit" data-type="menu" data-id="${item.id}">Edit</button>
                <button class="btn-delete" data-type="menu" data-id="${item.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    attachTableActions('menu');
}

// ============================================
// WINERY MANAGEMENT
// ============================================
function initWinery() {
    renderWineryTable();

    document.getElementById('addWineItem').addEventListener('click', () => {
        openEditModal('winery', null);
    });
}

function renderWineryTable() {
    const tbody = document.getElementById('wineryTableBody');
    tbody.innerHTML = '';

    cmsData.winery.sort((a, b) => a.order - b.order).forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <button class="btn-move" data-id="${item.id}" title="Drag to reorder">⋮⋮</button>
            </td>
            <td>
                <div class="item-with-image">
                    <div class="table-image-preview wine">
                        <img src="${item.image || ''}" alt="${item.name}" onerror="this.innerHTML='🍷'">
                    </div>
                    <span>${item.name}</span>
                </div>
            </td>
            <td><span class="wine-type-badge ${item.type.toLowerCase()}">${item.type}</span></td>
            <td>${item.year}</td>
            <td class="price-cell">R${item.price}</td>
            <td class="desc-cell">${item.description}</td>
            <td class="table-actions">
                <button class="btn-edit" data-type="winery" data-id="${item.id}">Edit</button>
                <button class="btn-delete" data-type="winery" data-id="${item.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    attachTableActions('winery');
}

// ============================================
// LOUNGES
// ============================================
function initLounges() {
    renderLoungesTable();

    document.getElementById('addLounge').addEventListener('click', () => {
        openEditModal('lounge', null);
    });

    // Load saved settings
    const s = cmsData.loungeSettings;
    document.getElementById('loungeDeposit').value = s.deposit;
    document.getElementById('loungeCancelFee').value = s.cancelFee;
    document.getElementById('loungeAdvance').value = s.advanceBooking;
    document.getElementById('loungeOpenTime').value = s.openTime;
    document.getElementById('loungeCloseTime').value = s.closeTime;
    document.getElementById('loungeSlotDuration').value = s.slotDuration;

    document.getElementById('saveLoungeSettings').addEventListener('click', () => {
        cmsData.loungeSettings = {
            deposit: parseInt(document.getElementById('loungeDeposit').value),
            cancelFee: parseInt(document.getElementById('loungeCancelFee').value),
            advanceBooking: parseInt(document.getElementById('loungeAdvance').value),
            openTime: document.getElementById('loungeOpenTime').value,
            closeTime: document.getElementById('loungeCloseTime').value,
            slotDuration: parseInt(document.getElementById('loungeSlotDuration').value)
        };
        saveData(cmsData);
        showToast('Lounge settings saved!');
    });
}

function renderLoungesTable() {
    const tbody = document.getElementById('loungesTableBody');
    tbody.innerHTML = '';

    cmsData.lounges.forEach(lounge => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="table-image-preview">
                    <img src="${lounge.image || ''}" alt="${lounge.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2240%22><rect fill=%22%231a1a1a%22 width=%2260%22 height=%2240%22/><text fill=%22%23555%22 x=%2230%22 y=%2224%22 font-size=%228%22 text-anchor=%22middle%22>🛋️</text></svg>'">
                </div>
            </td>
            <td><strong>${lounge.name}</strong><br><small style="color:#888">${lounge.description}</small></td>
            <td>${lounge.capacity} guests</td>
            <td class="price-cell">R${lounge.hourlyRate}/hr</td>
            <td>${lounge.minHours} hrs</td>
            <td><span class="status-badge ${lounge.status}">${lounge.status}</span></td>
            <td class="table-actions">
                <button class="btn-edit" data-type="lounge" data-id="${lounge.id}">Edit</button>
                <button class="btn-delete" data-type="lounge" data-id="${lounge.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    attachTableActions('lounge');
}

// ============================================
// IMAGES
// ============================================
function initImages() {
    renderImagesGrid();

    document.getElementById('addImage').addEventListener('click', () => {
        openImageUploadModal();
    });
}

function renderImagesGrid() {
    const grid = document.getElementById('imagesGrid');
    grid.innerHTML = '';

    cmsData.images.forEach(image => {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.innerHTML = `
            <img src="${image.url}" alt="${image.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22150%22><rect fill=%22%231a1a1a%22 width=%22200%22 height=%22150%22/><text fill=%22%23888%22 x=%22100%22 y=%2275%22 text-anchor=%22middle%22>No Image</text></svg>'">
            <div class="image-info">
                <span class="image-name">${image.name}</span>
                <span class="image-section">${image.section}</span>
            </div>
            <div class="image-actions">
                <button class="btn-delete" data-type="image" data-id="${image.id}">×</button>
            </div>
        `;
        grid.appendChild(card);
    });

    // Attach delete handlers
    grid.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            if (confirm('Delete this image?')) {
                cmsData.images = cmsData.images.filter(img => img.id !== id);
                saveData(cmsData);
                renderImagesGrid();
                showToast('Image deleted!');
            }
        });
    });
}

function openImageUploadModal() {
    const modal = document.getElementById('editModal');
    const title = document.getElementById('editModalTitle');
    const fields = document.getElementById('editFormFields');

    title.textContent = 'Upload Image';
    fields.innerHTML = `
        <div class="image-upload-zone" id="imageUploadZone">
            <div class="upload-content">
                <div class="upload-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                </div>
                <p class="upload-text">Drag & drop an image here</p>
                <span class="upload-hint">or click to browse</span>
                <input type="file" id="imageFileInput" accept="image/*" hidden>
            </div>
            <div class="upload-preview" id="uploadPreview" style="display: none;">
                <img id="previewImage" src="" alt="Preview">
                <button type="button" class="btn-remove-preview" id="removePreview">×</button>
            </div>
        </div>
        <div class="form-group">
            <label>Image Name</label>
            <input type="text" name="name" id="imageName" placeholder="e.g., hero-new.jpg" required>
        </div>
        <div class="form-group">
            <label>Section</label>
            <select name="section" id="imageSection">
                <option value="hero">Hero Slider</option>
                <option value="gallery">Gallery</option>
                <option value="banner">Banner</option>
                <option value="menu">Menu Items</option>
                <option value="other">Other</option>
            </select>
        </div>
    `;

    // Setup upload zone
    setTimeout(() => {
        setupImageUpload();
    }, 100);

    currentEditType = 'image-upload';
    currentEditId = null;
    modal.classList.add('active');
}

function setupImageUpload() {
    const zone = document.getElementById('imageUploadZone');
    const input = document.getElementById('imageFileInput');
    const preview = document.getElementById('uploadPreview');
    const previewImg = document.getElementById('previewImage');
    const removeBtn = document.getElementById('removePreview');
    const nameInput = document.getElementById('imageName');

    // Click to upload
    zone.addEventListener('click', (e) => {
        if (!e.target.closest('.upload-preview')) {
            input.click();
        }
    });

    // Drag & drop
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageFile(file);
        }
    });

    // File input change
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageFile(file);
        }
    });

    // Remove preview
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        preview.style.display = 'none';
        zone.querySelector('.upload-content').style.display = 'flex';
        previewImg.src = '';
        input.value = '';
    });

    function handleImageFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
            zone.querySelector('.upload-content').style.display = 'none';
            if (!nameInput.value) {
                nameInput.value = file.name;
            }
        };
        reader.readAsDataURL(file);
    }
}

// ============================================
// SETTINGS
// ============================================
function initSettings() {
    // Load saved settings
    const s = cmsData.settings;
    document.getElementById('siteName').value = s.siteName;
    document.getElementById('siteTagline').value = s.tagline;
    document.getElementById('sitePhone').value = s.phone;
    document.getElementById('siteEmail').value = s.email;
    document.getElementById('socialInstagram').value = s.instagram;
    document.getElementById('socialFacebook').value = s.facebook;
    document.getElementById('socialTiktok').value = s.tiktok;
    document.getElementById('addressStreet').value = s.addressStreet;
    document.getElementById('addressArea').value = s.addressArea;
    document.getElementById('addressCountry').value = s.addressCountry;

    document.getElementById('saveSettings').addEventListener('click', () => {
        cmsData.settings = {
            siteName: document.getElementById('siteName').value,
            tagline: document.getElementById('siteTagline').value,
            phone: document.getElementById('sitePhone').value,
            email: document.getElementById('siteEmail').value,
            instagram: document.getElementById('socialInstagram').value,
            facebook: document.getElementById('socialFacebook').value,
            tiktok: document.getElementById('socialTiktok').value,
            addressStreet: document.getElementById('addressStreet').value,
            addressArea: document.getElementById('addressArea').value,
            addressCountry: document.getElementById('addressCountry').value
        };
        saveData(cmsData);
        showToast('Settings saved!');
    });
}

// ============================================
// MODALS
// ============================================
let currentEditType = null;
let currentEditId = null;

function initModals() {
    const modal = document.getElementById('editModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelEdit');
    const form = document.getElementById('editForm');

    closeBtn.addEventListener('click', closeEditModal);
    cancelBtn.addEventListener('click', closeEditModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeEditModal();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (currentEditType === 'image-upload') {
            saveImageUpload();
        } else {
            saveEditForm();
        }
    });
}

function openEditModal(type, id) {
    currentEditType = type;
    currentEditId = id;

    const modal = document.getElementById('editModal');
    const title = document.getElementById('editModalTitle');
    const fields = document.getElementById('editFormFields');


    let item = null;
    if (id !== null) {
        const collection = type === 'event' ? 'events' : type === 'lounge' ? 'lounges' : type;
        item = cmsData[collection].find(i => i.id === id);
    }

    title.textContent = id ? `Edit ${type}` : `Add New ${type}`;
    fields.innerHTML = getFormFields(type, item);

    // Setup image upload preview after render
    setTimeout(() => {
        setupFormImageUpload();
    }, 100);

    modal.classList.add('active');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    currentEditType = null;
    currentEditId = null;
}

function getFormFields(type, item) {
    const fieldConfigs = {
        event: [
            { name: 'name', label: 'Event Name', type: 'text', required: true },
            { name: 'category', label: 'Category', type: 'select', options: ['Music', 'Literary', 'Art', 'Food', 'Special'] },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'image', label: 'Event Image', type: 'image' }
        ],
        menu: [
            { name: 'name', label: 'Item Name', type: 'text', required: true },
            { name: 'category', label: 'Category', type: 'select', options: ['BOWLS', 'TOASTIES', 'MAINS', 'SALADS', 'PASTRY', 'SKILLETS', 'DRINKS', 'DESSERT'] },
            { name: 'price', label: 'Price (R)', type: 'number', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'badge', label: 'Badge', type: 'select', options: ['', 'SIGNATURE', 'CAFÉ CLASSIC', 'FRESH', 'NEW', 'POPULAR', 'VEGAN'] },
            { name: 'image', label: 'Item Image', type: 'image' }
        ],
        winery: [
            { name: 'name', label: 'Wine Name', type: 'text', required: true },
            { name: 'type', label: 'Type', type: 'select', options: ['Red', 'White', 'Rosé', 'Champagne', 'Sparkling', 'Dessert'] },
            { name: 'year', label: 'Year', type: 'text' },
            { name: 'price', label: 'Price (R)', type: 'number', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'image', label: 'Wine Image', type: 'image' }
        ],
        lounge: [
            { name: 'name', label: 'Lounge Name', type: 'text', required: true },
            { name: 'capacity', label: 'Capacity (guests)', type: 'number', required: true },
            { name: 'hourlyRate', label: 'Hourly Rate (R)', type: 'number', required: true },
            { name: 'minHours', label: 'Minimum Hours', type: 'number', required: true },
            { name: 'status', label: 'Status', type: 'select', options: ['available', 'unavailable', 'maintenance'] },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'image', label: 'Lounge Image', type: 'image' }
        ]
    };

    const config = fieldConfigs[type] || [];
    return config.map(field => {
        const value = item ? (item[field.name] || '') : '';
        let input = '';

        if (field.type === 'textarea') {
            input = `<textarea name="${field.name}" ${field.required ? 'required' : ''}>${value}</textarea>`;
        } else if (field.type === 'select') {
            const options = field.options.map(opt =>
                `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt || '— None —'}</option>`
            ).join('');
            input = `<select name="${field.name}">${options}</select>`;
        } else if (field.type === 'image') {
            input = `
                <div class="form-image-upload" data-field="${field.name}">
                    <div class="current-image" ${value ? '' : 'style="display:none"'}>
                        <img src="${value}" alt="Current">
                        <button type="button" class="btn-change-image">Change</button>
                    </div>
                    <div class="upload-zone-mini" ${value ? 'style="display:none"' : ''}>
                        <div class="upload-icon-mini">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                        </div>
                        <span>Click to upload</span>
                        <input type="file" accept="image/*" class="form-image-input" hidden>
                    </div>
                    <input type="hidden" name="${field.name}" value="${value}">
                </div>
            `;
        } else {
            input = `<input type="${field.type}" name="${field.name}" value="${value}" ${field.required ? 'required' : ''}>`;
        }

        return `<div class="form-group"><label>${field.label}</label>${input}</div>`;
    }).join('');
}

function setupFormImageUpload() {
    document.querySelectorAll('.form-image-upload').forEach(container => {
        const zone = container.querySelector('.upload-zone-mini');
        const currentImage = container.querySelector('.current-image');
        const input = container.querySelector('.form-image-input');
        const hiddenInput = container.querySelector('input[type="hidden"]');
        const changeBtn = container.querySelector('.btn-change-image');

        if (zone) {
            zone.addEventListener('click', () => input.click());
        }

        if (changeBtn) {
            changeBtn.addEventListener('click', () => {
                input.click();
            });
        }

        if (input) {
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        // For demo, we'll use data URL (in production, upload to server)
                        hiddenInput.value = ev.target.result;
                        if (currentImage) {
                            currentImage.querySelector('img').src = ev.target.result;
                            currentImage.style.display = 'flex';
                            zone.style.display = 'none';
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    });
}

function saveEditForm() {
    const form = document.getElementById('editForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const collection = currentEditType === 'event' ? 'events' : currentEditType === 'lounge' ? 'lounges' : currentEditType;

    if (currentEditId) {
        // Update existing
        const index = cmsData[collection].findIndex(i => i.id === currentEditId);
        if (index !== -1) {
            cmsData[collection][index] = { ...cmsData[collection][index], ...data };
            if (data.price) cmsData[collection][index].price = parseInt(data.price);
            if (data.hourlyRate) cmsData[collection][index].hourlyRate = parseInt(data.hourlyRate);
            if (data.capacity) cmsData[collection][index].capacity = parseInt(data.capacity);
            if (data.minHours) cmsData[collection][index].minHours = parseInt(data.minHours);
        }
    } else {
        // Add new
        const newItem = {
            id: Date.now(),
            order: cmsData[collection].length + 1,
            ...data
        };
        if (data.price) newItem.price = parseInt(data.price);
        if (data.hourlyRate) newItem.hourlyRate = parseInt(data.hourlyRate);
        if (data.capacity) newItem.capacity = parseInt(data.capacity);
        if (data.minHours) newItem.minHours = parseInt(data.minHours);
        cmsData[collection].push(newItem);
    }

    saveData(cmsData);
    closeEditModal();

    // Re-render appropriate table
    if (currentEditType === 'event') renderEventsTable();
    else if (currentEditType === 'menu') renderMenuTable();
    else if (currentEditType === 'winery') renderWineryTable();
    else if (currentEditType === 'lounge') renderLoungesTable();

    updateStats();
    showToast(currentEditId ? 'Item updated!' : 'Item added!');
}

function saveImageUpload() {
    const name = document.getElementById('imageName').value;
    const section = document.getElementById('imageSection').value;
    const previewImg = document.getElementById('previewImage');

    if (!name || !previewImg.src) {
        alert('Please select an image and enter a name');
        return;
    }

    const newImage = {
        id: Date.now(),
        name: name,
        url: previewImg.src,
        section: section
    };

    cmsData.images.push(newImage);
    saveData(cmsData);
    closeEditModal();
    renderImagesGrid();
    showToast('Image uploaded!');
}

// Table action handlers
function attachTableActions(type) {
    const collection = type === 'event' ? 'events' : type === 'lounge' ? 'lounges' : type;

    document.querySelectorAll(`.btn-edit[data-type="${type}"]`).forEach(btn => {
        btn.addEventListener('click', () => {
            openEditModal(type, parseInt(btn.dataset.id));
        });
    });

    document.querySelectorAll(`.btn-delete[data-type="${type}"]`).forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            if (confirm('Are you sure you want to delete this item?')) {
                cmsData[collection] = cmsData[collection].filter(i => i.id !== id);
                saveData(cmsData);

                if (type === 'event') renderEventsTable();
                else if (type === 'menu') renderMenuTable();
                else if (type === 'winery') renderWineryTable();
                else if (type === 'lounge') renderLoungesTable();

                updateStats();
                showToast('Item deleted!');
            }
        });
    });
}

// ============================================
// EXPORT / IMPORT
// ============================================
function initExportImport() {
    document.getElementById('exportData').addEventListener('click', () => {
        const dataStr = JSON.stringify(cmsData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bertrand-cms-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Data exported!');
    });

    document.getElementById('importData').addEventListener('click', () => {
        document.getElementById('importModal').classList.add('active');
    });

    document.getElementById('closeImportModal').addEventListener('click', () => {
        document.getElementById('importModal').classList.remove('active');
    });

    document.getElementById('cancelImport').addEventListener('click', () => {
        document.getElementById('importModal').classList.remove('active');
    });

    document.getElementById('importFileInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('importJsonInput').value = event.target.result;
            };
            reader.readAsText(file);
        }
    });

    document.getElementById('confirmImport').addEventListener('click', () => {
        const jsonText = document.getElementById('importJsonInput').value;
        try {
            const importedData = JSON.parse(jsonText);
            cmsData = { ...defaultData, ...importedData };
            saveData(cmsData);

            // Refresh all sections
            renderEventsTable();
            renderMenuTable();
            renderWineryTable();
            renderImagesGrid();
            updateStats();

            document.getElementById('importModal').classList.remove('active');
            document.getElementById('importJsonInput').value = '';
            showToast('Data imported successfully!');
        } catch (e) {
            alert('Invalid JSON format. Please check your data.');
        }
    });
}

// ============================================
// UTILITIES
// ============================================
function showToast(message) {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2a8f6e;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
