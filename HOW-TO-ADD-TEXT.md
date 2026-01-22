# How to Add Text to Your Portfolio

This guide explains the simple workflow for adding text descriptions to your portfolio website.

## The File: `text-content.json`

All text content for your website is managed in **one single file**: `text-content.json`

This file contains:
- Contact page text
- Project page titles and descriptions
- Section titles and descriptions within each project
- **Image descriptions** (appears in lightbox when hovering)

## How It Works

### Step 1: Edit `text-content.json`

Open `text-content.json` and add your text to the appropriate location.

**Example - Adding text to the Contact page:**
```json
"contact": {
  "description": "Email: your@email.com\nInstagram: @yourhandle"
}
```

**Example - Adding a project description:**
```json
"brands": {
  "title": "Brands",
  "description": "Brand identity and design work for wineries and lifestyle brands.",
  "sections": { ... }
}
```

**Example - Adding a section description:**
```json
"1-testarossa": {
  "title": "Testarossa Winery",
  "description": "Complete brand identity including wine labels, packaging, and marketing materials for a California winery.",
  "images": [ ... ]
}
```

**Example - Adding image descriptions (for lightbox hover text):**
```json
"images": [
  {
    "file": "0_TR.jpg",
    "description": "Wine label design for Pinot Noir 2021"
  },
  {
    "file": "1_TR.jpg",
    "description": "Brand identity system overview"
  }
]
```

### Step 2: Regenerate the Static Pages

After editing `text-content.json`, run this command:

```bash
python3 generate-static-site.py
```

This will regenerate all HTML pages with your new text.

### Step 3: Test Locally

Open the pages in your browser to verify the text looks good:
```bash
python3 -m http.server 8000
```

Then visit: http://localhost:8000

### Step 4: Commit and Push

When you're happy with the changes, tell me to commit and push.

## Adding Text Step-by-Step

You can add text **one piece at a time** or **all at once** - whatever is easier for you.

### Simple Format for Sending Me Updates

Just tell me:
- **Which section** you want to update
- **The text** to add

**Examples:**

"Add to Contact page: Email me at olena@example.com"

"Add to Brands > Testarossa Winery: Complete brand identity including wine labels and packaging."

"Add to Magazines description: Editorial design for fashion publications including ELLE and Cosmopolitan."

"Add image description for Brands > Testarossa > 0_TR.jpg: Wine label design for Pinot Noir 2021"

I'll understand where to put it and update the file for you, then regenerate the pages.

## Image Descriptions

Each image can have a description that appears in the lightbox when you hover over it.

The file `text-content.json` now contains **all images** from your gallery, listed by filename within each section. Simply add descriptions where you want them - leave others blank.

**Example structure:**
```json
"1-testarossa": {
  "title": "Testarossa Winery",
  "description": "test test test test",
  "images": [
    {
      "file": "0_TR.jpg",
      "description": ""
    },
    {
      "file": "1_TR.jpg",
      "description": ""
    }
  ]
}
```

**Note:** If you add new images to your gallery, run `python3 populate-image-descriptions.py` to update the text-content.json file with the new images.

## Structure Overview

```
text-content.json
├── contact
│   └── description
└── projects
    ├── brands
    │   ├── title
    │   ├── description
    │   └── sections
    │       ├── 1-testarossa (title + description)
    │       ├── 2-passion-embrace (title + description)
    │       └── ...
    ├── magazines
    │   ├── title
    │   ├── description
    │   └── sections
    │       └── ...
    └── ... (all other projects)
```

## Tips

- **Empty strings** (`""`) mean no text will be shown - that's fine!
- **Line breaks**: Use `\n` for new lines in descriptions
- **Special characters**: JSON doesn't allow unescaped quotes, use `\"` for quotes in text
- **Keep it simple**: Just plain text, no HTML formatting needed
