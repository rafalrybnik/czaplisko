# Czaplisko Siedlisko - Static HTML Template

A clean, production-ready HTML template for the Czaplisko Siedlisko eco-guesthouse website. Built with pure HTML, Tailwind CSS, and vanilla JavaScript - no frameworks required.

## 📁 Project Structure

```
static-html/
├── index.html              # Home page
├── apartments.html         # Apartments showcase
├── price-list.html         # Seasonal pricing
├── gallery.html            # Image gallery with lightbox
├── faq.html               # Questions & Answers
├── contact.html           # Contact form + map
├── css/
│   └── styles.css         # Custom styles
├── js/
│   └── main.js            # All JavaScript functionality
└── README.md              # This file
```

## 🚀 Quick Start

### Option 1: Direct Upload
1. Upload all files to your web server
2. Ensure folder structure is maintained
3. Access `index.html` in your browser
4. Done! No build process required.

### Option 2: Local Testing
1. Open `index.html` in any modern web browser
2. Or use a simple HTTP server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve
   
   # PHP
   php -S localhost:8000
   ```
3. Navigate to `http://localhost:8000`

## ✨ Features

### Pages
- **Home** (`index.html`): Hero slider, intro, apartments preview, features, locations, blog
- **Apartments** (`apartments.html`): Luxury suites and eco-cabins showcase
- **Price List** (`price-list.html`): Seasonal pricing (Summer/Winter)
- **Gallery** (`gallery.html`): Full-screen lightbox gallery with animated statistics
- **FAQ** (`faq.html`): Accordion-style questions and answers
- **Contact** (`contact.html`): Contact form with Google Maps integration

### Interactive Features
- ✅ Mobile-responsive navigation with hamburger menu
- ✅ Auto-playing hero image slider
- ✅ Gallery lightbox with keyboard navigation
- ✅ FAQ accordion expand/collapse
- ✅ Contact form validation
- ✅ Smooth scrolling
- ✅ Animated counters (Gallery page)

## 🎨 Technology Stack

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **Vanilla JavaScript**: No frameworks, pure JS
- **FontAwesome**: Icon library
- **Google Fonts**: Montserrat typography

## 📋 Copy-Paste Reusable Sections

All reusable sections are marked with HTML comments for easy identification:

### Header Section
```html
<!-- ========== HEADER SECTION - START ========== -->
<!-- Copy this entire block to all pages -->
<header class="w-full bg-white...">
  <!-- Header content -->
</header>
<!-- ========== HEADER SECTION - END ========== -->
```

### Footer Section
```html
<!-- ========== FOOTER SECTION - START ========== -->
<!-- Copy this entire block to all pages -->
<footer class="bg-white border-t...">
  <!-- Footer content -->
</footer>
<!-- ========== FOOTER SECTION - END ========== -->
```

### How to Use Reusable Sections
1. Open any HTML file
2. Find the section marked with `<!-- ========== SECTION NAME - START ========== -->`
3. Copy everything between START and END comments
4. Paste into another HTML file
5. Update active navigation state if needed

## 🔧 Customization Guide

### Changing Colors
The site uses a consistent color palette:
- **Primary Blue**: `#78b3ce`
- **Dark Blue**: `#4a6b8a`
- **Charcoal**: `#1a2b3c`

To change colors, search and replace these hex values across all HTML files.

### Updating Navigation
1. Open any HTML file
2. Find the `<nav>` section
3. Update the active page by:
   - Adding `text-gray-900 font-medium` classes
   - Changing `scale-x-0` to `scale-x-100` on the underline span

### Adding New Pages
1. Copy an existing HTML file (e.g., `apartments.html`)
2. Rename it to your new page name
3. Update the `<title>` and meta tags
4. Replace the main content section
5. Update navigation links in header to include new page

### Changing Images
All images use external URLs (Unsplash). To use local images:
1. Create an `images/` folder
2. Add your images
3. Replace URLs like:
   ```html
   <!-- From: -->
   <img src="https://images.unsplash.com/photo-..." alt="...">
   
   <!-- To: -->
   <img src="images/your-image.jpg" alt="...">
   ```

## 🌐 Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## 🔍 SEO Best Practices

Each page includes:
- Unique `<title>` tags
- Meta descriptions
- Semantic HTML5 elements
- Proper heading hierarchy (H1 → H6)
- Alt text for all images
- Unique IDs for interactive elements

## 🎯 Performance Optimization

- **Tailwind CDN**: Fast loading via CDN
- **Image Optimization**: External CDN images are auto-optimized
- **Minimal JavaScript**: Only essential functionality
- **No Build Process**: Direct deployment

### For Production (Optional Improvements)
1. **Use Tailwind CLI** to generate minified CSS:
   ```bash
   npx tailwindcss -o css/tailwind.min.css --minify
   ```
2. **Download and host images locally** for better control
3. **Minify JavaScript** using tools like UglifyJS
4. **Enable Gzip compression** on your web server

## 📝 Deployment Instructions

### Static Hosting (Recommended)
Upload to any of these services:
- **Netlify**: Drag and drop the `static-html` folder
- **Vercel**: Connect via Git or drag and drop
- **GitHub Pages**: Push to repository and enable Pages
- **AWS S3**: Upload as static website
- **Traditional Hosting**: FTP upload to public_html

### Server Configuration
No special configuration needed! Just ensure:
- Directory listing is disabled
- `index.html` is set as default document
- HTTPS is enabled (recommended)

## 🐛 Troubleshooting

### Mobile menu not working
- Check that `js/main.js` is loaded
- Verify the `mobile-menu-toggle` ID exists
- Check browser console for JavaScript errors

### Images not loading
- Verify internet connection (images use external URLs)
- Check if Unsplash is accessible
- Consider downloading images locally

### Tailwind styles not applying
- Ensure Tailwind CDN script is in `<head>`
- Check for JavaScript errors blocking CSS
- Try clearing browser cache

## 📞 Support

For questions or issues:
- Review this README
- Check HTML comments in files
- Verify all files are uploaded correctly

## 📄 License

This template is created for Czaplisko Siedlisko. All rights reserved.

---

**Built with ❤️ for Czaplisko Siedlisko**  
Western Masuria, Poland
