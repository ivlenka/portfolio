# Gallery Setup Guide

This portfolio uses a dynamic gallery system that automatically loads images from the `images/gallery` folder.

## Folder Structure

```
images/gallery/
├── magazines/
│   ├── ellegirl/    (put Elle Girl magazine images here)
│   ├── elle/        (put Elle magazine images here)
│   └── cosmo/       (put Cosmopolitan images here)
├── illustration/    (put illustration/comic images here)
├── brands/          (put brand design images here)
├── prints/          (put print design images here)
├── digital/         (put digital design images here)
├── logos/           (put logo design images here)
├── animation/       (put animation images here)
└── unsorted/        (put unsorted images here)
```

## How to Update Gallery Images

### Step 1: Add Your Images

1. Navigate to `images/gallery/[project-name]/[section-name]/`
2. Add your JPG, PNG, GIF, or WEBP images
3. Images will be displayed in alphabetical order

**Example for magazines:**
```
images/gallery/magazines/ellegirl/
├── cover1.jpg
├── spread1.jpg
├── spread2.jpg
└── ...
```

**Example for illustration (no subsections):**
```
images/gallery/illustration/
├── comic1.jpg
├── comic2.jpg
└── ...
```

### Step 2: Generate Gallery Data

Run the generation script:

```bash
./generate-gallery.sh
```

This will:
- Scan all images in `images/gallery/`
- Generate `gallery-data.json` with all image paths
- The website will automatically load images from this file

### Step 3: Refresh Your Browser

The website will now display your images using the bin packing layout with:
- Automatic optimal arrangement
- Hover overlays with descriptions
- Lightbox viewing
- "See more" button for galleries with 6+ rows

## Supported Image Formats

- JPG/JPEG
- PNG
- GIF
- WEBP
- SVG

## Project Configuration

Edit `project.js` to customize:
- Project titles and descriptions
- Section names
- Custom image descriptions

## Tips

- Use consistent image naming (e.g., `image001.jpg`, `image002.jpg`)
- Keep image file sizes reasonable (under 2MB recommended)
- Run `generate-gallery.sh` every time you add/remove images
- The script automatically ignores hidden files (`.DS_Store`, etc.)
