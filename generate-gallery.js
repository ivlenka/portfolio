#!/usr/bin/env node

/**
 * Gallery Generator Script
 *
 * This script scans the images/gallery folder and generates a gallery-data.json file
 * containing all image paths organized by project folders.
 *
 * Usage: node generate-gallery.js
 *
 * Folder structure expected:
 * images/gallery/
 *   ├── magazines/
 *   │   ├── ellegirl/
 *   │   ├── elle/
 *   │   └── cosmo/
 *   ├── illustration/
 *   ├── brands/
 *   └── ...
 */

const fs = require('fs');
const path = require('path');

const GALLERY_BASE = path.join(__dirname, 'images', 'gallery');
const OUTPUT_FILE = path.join(__dirname, 'gallery-data.json');

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

function isImageFile(filename) {
    const ext = path.extname(filename).toLowerCase();
    return IMAGE_EXTENSIONS.includes(ext);
}

function scanDirectory(dirPath, relativePath = '') {
    const items = fs.readdirSync(dirPath);
    const result = {
        folders: {},
        images: []
    };

    items.forEach(item => {
        // Skip hidden files and DS_Store
        if (item.startsWith('.')) return;

        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            const subRelativePath = relativePath ? `${relativePath}/${item}` : item;
            result.folders[item] = scanDirectory(fullPath, subRelativePath);
        } else if (isImageFile(item)) {
            const imagePath = relativePath ? `images/gallery/${relativePath}/${item}` : `images/gallery/${item}`;
            result.images.push(imagePath);
        }
    });

    return result;
}

function generateGalleryData() {
    // Check if gallery directory exists
    if (!fs.existsSync(GALLERY_BASE)) {
        console.error('Error: images/gallery directory not found!');
        console.log('Creating example structure...');

        // Create example structure
        fs.mkdirSync(GALLERY_BASE, { recursive: true });
        fs.mkdirSync(path.join(GALLERY_BASE, 'magazines', 'ellegirl'), { recursive: true });
        fs.mkdirSync(path.join(GALLERY_BASE, 'magazines', 'elle'), { recursive: true });
        fs.mkdirSync(path.join(GALLERY_BASE, 'magazines', 'cosmo'), { recursive: true });
        fs.mkdirSync(path.join(GALLERY_BASE, 'illustration'), { recursive: true });

        console.log('Created images/gallery folder structure.');
        console.log('Add your images to the folders and run this script again.');
        return;
    }

    console.log('Scanning gallery directory...');
    const galleryData = scanDirectory(GALLERY_BASE);

    // Write to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(galleryData, null, 2));

    console.log(`✓ Gallery data generated: ${OUTPUT_FILE}`);
    console.log(`  Found ${countImages(galleryData)} images`);
}

function countImages(data) {
    let count = data.images.length;
    Object.values(data.folders).forEach(folder => {
        count += countImages(folder);
    });
    return count;
}

// Run the generator
try {
    generateGalleryData();
} catch (error) {
    console.error('Error generating gallery data:', error.message);
    process.exit(1);
}
