# Static Site Generator for Portfolio

This portfolio is now **fully static** - all HTML pages are pre-generated ahead of time, eliminating JavaScript-based layout calculations and improving load times.

## How It Works

### Static Pages
- Each project (Brands, Magazines, Prints, etc.) has its own pre-generated HTML file
- Layout is calculated once during build time, not on every page load
- JavaScript is only used for interactive features (lightbox, video controls)

### Generated Files
- `project-brands.html` - Brands project page
- `project-magazines.html` - Magazines project page
- `project-prints.html` - Prints project page
- `project-digital.html` - Digital project page
- `project-logos.html` - Logos project page
- `project-illustration.html` - Illustration project page
- `project-animation.html` - Animation project page
- `project-unsorted.html` - Display project page

## Regenerating Pages

Whenever you add new images or update `gallery-data.json`, run:

```bash
python3 generate-static-site.py
```

This will:
1. Read `gallery-data.json`
2. Calculate optimal bin-packed layout for each section
3. Generate static HTML for all 8 project pages
4. Use thumbnails for fast loading

## What's Dynamic vs Static

### Static (Pre-generated)
- ✓ All HTML page structure
- ✓ Image grid layouts (bin-packed)
- ✓ All section organization
- ✓ Navigation links

### Dynamic (JavaScript)
- ✓ Lightbox for viewing full images
- ✓ Video play/pause on hover
- ✓ Sound toggle buttons
- ✓ "See more" buttons
- ✓ Image protection
- ✓ Homepage cover rotation

## Files Structure

### Build Script
- `generate-static-site.py` - Main build script that generates all pages

### JavaScript (Interactive Only)
- `lightbox.js` - Lightbox functionality
- `homepage-covers.js` - Homepage cover image rotation
- `smooth-hover.js` - Smooth hover effects
- `image-protection.js` - Prevent image copying

### Data
- `gallery-data.json` - Source of truth for all images

### Static Pages (Generated)
- All `project-*.html` files

## Benefits

1. **Faster Page Loads** - No layout calculation on client side
2. **Better SEO** - All content is in HTML, no JavaScript required
3. **Reduced JavaScript** - Only interactive features use JS
4. **Easier Debugging** - View source shows actual content
5. **Better Performance** - Thumbnails loaded for layout, full images only in lightbox

## When to Regenerate

Run `python3 generate-static-site.py` whenever you:
- Add new images to any project
- Update `gallery-data.json`
- Change project organization
- Modify section configurations

The script will regenerate all 8 project pages in a few seconds.
