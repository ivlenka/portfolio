# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static portfolio website for showcasing design projects. It's a simple HTML/CSS/JS site with no build process or dependencies - files can be opened directly in a browser.

## Development

**No build required** - This is a static site. Simply open `index.html` in a web browser to view.

**File serving** - For local development with proper routing, use any static file server:
```bash
python -m http.server 8000
# or
npx serve
```

## Architecture

### Page Structure

The site uses a **shared sidebar navigation pattern** across all pages:
- Logo and name in top left
- About/Contact links below name
- Projects menu with 8 project links

All pages (index.html, project.html, about.html, contact.html) share identical sidebar HTML structure. When updating navigation, all 4 files must be updated in sync.

### Content Management System

**Project data is centralized in `project.js`**:
- Single source of truth for project metadata (category, title, description)
- Projects object uses URL parameter IDs as keys (e.g., `brands`, `copy1`)
- `project.html` is a template that dynamically loads content based on `?id=` URL parameter

**When adding/removing projects:**
1. Add/remove entry in `project.js` projects object
2. Add/remove grid item in `index.html` (lines 40-89)
3. Add/remove link in sidebar navigation on ALL 4 HTML files (lines 27-34)

### Styling Architecture

**Two-tier CSS system:**
- `styles.css` - Base styles for sidebar, navigation, and home page grid layout
- `project-styles.css` - Additional styles specific to project detail pages

Both files are loaded on project.html to combine base + page-specific styles.

**Layout method:**
- Flexbox for main container (sidebar + content)
- CSS Grid for project thumbnail grid (3 columns, responsive to 2 then 1)
- Fixed sidebar (250px width, 100vh height)

### Image System

**Current state:** All project thumbnails and detail images use empty placeholder divs with `background-color: #2b2b2b`

**To add images:**
- Images go in `images/` folder (logo5.png already present)
- Replace `<div class="project-thumbnail"></div>` with img tag inside the div
- Use inline style `object-fit: cover` to maintain aspect ratios

## Key Implementation Details

**URL-based routing:**
- Project pages use query parameters: `project.html?id=brands`
- JavaScript reads `URLSearchParams` and loads corresponding data from `project.js`
- Default fallback is `brands` if no ID provided

**Responsive breakpoints:**
- 1200px: Grid changes from 3 to 2 columns
- 768px: Sidebar becomes relative (stacks on top), grid becomes 1 column

**Navigation pattern:**
- Logo links to home on all pages except index.html (where it's static)
- All project links use same `project.html` template with different IDs
- Sidebar menu is duplicated across pages (not componentized)

## Common Modification Patterns

**Adding a new project category:**
1. Add to `project.js` with unique ID
2. Update `index.html` grid with new thumbnail
3. Add navigation link to sidebar on all 4 pages
4. Ensure ID in URL matches object key in project.js

**Changing the design:**
- Colors: Edit hex values in `styles.css`
- Layout spacing: Modify padding/gap in grid and sidebar
- Typography: Update `font-family` and `font-size` values
- Sidebar width: Change 250px value and corresponding `margin-left` on main-content

**Maintaining navigation consistency:**
When editing sidebar navigation, use the same exact HTML block across all 4 pages (index.html, project.html, about.html, contact.html) - any nav change requires 4-file update.
