# Bertrand Maboneng

> **The Soul of Maboneng. Reimagined.**

A maximalist sanctuary of Jazz, Vintage Furniture, and Parisian-style dining at 296 Fox Street, Maboneng, Johannesburg.

---

## Overview

This is the official website for **Bertrand Maboneng**, an 8-year landmark of Jazz and French-Congolese culture founded by Mr. Bertrand and managed by Gladys Semenye (LeChic).

### Design Philosophy

- **Aesthetic**: Maximalist Parisian Vogue
- **Color Palette**: Deep Charcoal, Antique Gold, Emerald Green
- **Typography**: Playfair Display (headlines), Cormorant Garamond (body), Montserrat (accents)
- **Tone**: Professional, sophisticated, and clinical precision

---

## Features

### Digital Waitlist
The primary goal of this website is to create an exclusive digital waitlist for the scarcity-based reopening launch.

### Sections

1. **Hero Section** - Grand entrance with headline, subheadline, and waitlist CTA
2. **One Roof Concept** - Showcases the five unique lounges:
   - The Cafeteria (Parisian-style dining)
   - Salon de Thé (Wellness tea room)
   - Wine Lounge
   - Cigar Lounge
   - Jazz Lounge
   - The Bottle Keep (Premium spirits storage)

3. **Weekly Rhythm** - The curated event calendar:
   - Monday: The Dice Roll
   - Tuesday: Cinema Night
   - Wednesday: Karaoke à la Paris
   - Thursday: Duality Night
   - Friday: Open Mic + Velvet Table
   - Saturday: Live Jazz Legacy
   - Sunday: Moon Bloom Buffet

4. **Heritage Section** - The story of Bertrand Maboneng
5. **Waitlist Modal** - Elegant form for capturing leads

---

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Flexbox, Grid, animations
- **Vanilla JavaScript** - No dependencies
- **Google Fonts** - Playfair Display, Cormorant Garamond, Montserrat

---

## Getting Started

### Local Development

1. Clone or download this repository
2. Open `index.html` in your browser
3. No build process required

### File Structure

```
Bertrand-Cafe/
├── index.html      # Main HTML file
├── styles.css      # All styles
├── script.js       # Interactive functionality
└── README.md       # Documentation
```

---

## Customization

### Colors

Edit CSS custom properties in `styles.css`:

```css
:root {
    --charcoal: #1a1a1a;
    --gold: #c9a962;
    --emerald: #1d6b52;
    --cream: #f5f0e8;
}
```

### Adding Images

Replace the placeholder in the Heritage section with actual images:

```html
<div class="heritage-image">
    <img src="path/to/your-image.jpg" alt="Bertrand Maboneng interior">
</div>
```

### Waitlist Integration

The form currently stores submissions in localStorage. To integrate with a backend:

1. Open `script.js`
2. Find the `handleFormSubmission` function
3. Replace the localStorage logic with your API call:

```javascript
async function handleFormSubmission(form, waitlistModal, successModal) {
    const formData = new FormData(form);
    
    try {
        const response = await fetch('YOUR_API_ENDPOINT', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            // Show success modal
            closeAllModals();
            setTimeout(() => openModal(successModal), 300);
            form.reset();
        }
    } catch (error) {
        console.error('Submission failed:', error);
    }
}
```

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## License

© 2026 Bertrand Maboneng. All rights reserved.

---

*Crafted with LeChic precision.*
