# Dynamic Gallery System

## Overview

This portfolio uses a dynamic gallery system that automatically loads images from the `images/gallery` folder. No need to manually update code when adding/removing images!

## Quick Start

### 1. Set Up Your Gallery Folder

Create your gallery structure:

```
images/gallery/
└── magazines/
    ├── ellegirl/       (32 images)
    ├── elle/           (4 images)
    └── cosmo/          (16 images)
```

### 2. Add Your Images

Simply drop your images into the appropriate folders.

### 3. Generate Gallery Data

Run the script:

```bash
./generate-gallery.sh
```

This creates `gallery-data.json` with all your image paths.

### 4. Use Dynamic Loading in project.js

**Example: Convert magazines to use dynamic loading**

```javascript
// OLD WAY (hardcoded):
if (projectId === 'magazines') {
    const imagePaths = [
        'images/2-magazines/1-ellegirl/image1.jpg',
        'images/2-magazines/1-ellegirl/image2.jpg',
        // ... 30 more lines ...
    ];
    // ... complex loading code ...
}

// NEW WAY (dynamic):
if (projectId === 'magazines') {
    renderDynamicGallery('magazines', {
        'ellegirl': 'Elle Girl',
        'elle': 'Elle',
        'cosmo': 'Cosmopolitan'
    });
}
```

That's it! Just 4 lines of code.

## Converting Existing Projects

### Before (Hardcoded - 80+ lines):

```javascript
if (projectId === 'magazines') {
    const projectImagesDiv = document.querySelector('.project-images');
    const imagePaths = [
        '0220644d-dbf2-4f5c-ab35-05f72f9b4c5e_rw_1920.jpg',
        '1063d72f-0c96-42a6-9acc-1680f9881208_rw_1200.jpg',
        // ... 30 more files ...
    ].map(filename => `images/2-magazines/1-ellegirl/${filename}`);

    Promise.all(imagePaths.map((src, index) => {
        // ... complex Promise code ...
    })).then(images => {
        // ... rendering code ...
    });
}
```

### After (Dynamic - 4 lines):

```javascript
if (projectId === 'magazines') {
    renderDynamicGallery('magazines', {
        'ellegirl': 'Elle Girl',
        'elle': 'Elle',
        'cosmo': 'Cosmopolitan'
    });
}
```

## API Reference

### `renderDynamicGallery(projectId, sectionTitles)`

Loads and renders a project gallery from `gallery-data.json`.

**Parameters:**
- `projectId` (string): Matches folder name in `images/gallery/`
- `sectionTitles` (object): Maps folder names to display titles

**Example:**

```javascript
// Load illustration project
renderDynamicGallery('illustration', {
    'main': 'Comic Illustrations'
});

// Load brands with multiple sections
renderDynamicGallery('brands', {
    'testarossa': 'Testarossa Winery',
    'nike': 'Nike Campaign',
    'apple': 'Apple Store'
});
```

## Folder Structure Examples

### Project with Multiple Sections

```
images/gallery/magazines/
├── ellegirl/
│   ├── cover1.jpg
│   ├── spread1.jpg
│   └── spread2.jpg
├── elle/
│   ├── cover1.jpg
│   └── editorial1.jpg
└── cosmo/
    └── feature1.jpg
```

Renders 3 sections: "Elle Girl", "Elle", "Cosmopolitan"

### Project with Single Section

```
images/gallery/illustration/
├── comic1.jpg
├── comic2.jpg
└── comic3.jpg
```

Renders 1 section: "Comic Illustrations" (uses 'main' section key)

## Features

✅ Automatic image scanning
✅ Bin packing layout algorithm
✅ Minimum 3 images per row
✅ Gallery hover overlays
✅ Lightbox viewing
✅ "See more" button for 6+ rows
✅ Multiple sections per project
✅ Works with any image format

## Workflow

1. **Add images** to `images/gallery/[project]/[section]/`
2. **Run** `./generate-gallery.sh`
3. **Refresh** browser - done!

No code changes needed after initial setup.

## Tips

- Name images sequentially: `image001.jpg`, `image002.jpg`
- Keep files under 2MB for best performance
- Run `generate-gallery.sh` after every image change
- Check `gallery-data.json` to verify your structure
- Use descriptive folder names (they become section titles)

## Troubleshooting

**"No images found" message?**
1. Check `images/gallery/[project]/` exists
2. Verify images are in correct folders
3. Run `./generate-gallery.sh`
4. Check browser console for errors

**Images not showing?**
1. Verify image paths in `gallery-data.json`
2. Check file extensions are supported
3. Ensure images aren't corrupt

## Example Conversion

Here's a complete before/after for the magazines project:

**Step 1:** Move images to gallery folder

```bash
mkdir -p images/gallery/magazines/{ellegirl,elle,cosmo}
# Move your images to these folders
```

**Step 2:** Generate gallery data

```bash
./generate-gallery.sh
```

**Step 3:** Update project.js

Replace the entire magazines `if` block with:

```javascript
if (projectId === 'magazines') {
    renderDynamicGallery('magazines', {
        'ellegirl': 'Elle Girl',
        'elle': 'Elle',
        'cosmo': 'Cosmopolitan'
    });
}
```

Done! 80 lines of code → 4 lines.
