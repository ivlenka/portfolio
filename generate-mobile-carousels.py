#!/usr/bin/env python3
"""
Mobile Carousel Generator
Scans images/mobile-covers/ folders and generates carousel HTML for index.html
Automatically detects image order based on filename numbering
"""

import os
import re
from pathlib import Path

# Mobile covers base directory
MOBILE_COVERS_BASE = "images/mobile-covers"

# Category mapping: folder name -> display name
CATEGORIES = {
    "1-brands": "BRANDS",
    "2-magazines": "MAGAZINES",
    "3-prints": "PRINTS",
    "4-digital": "DIGITAL",
    "5-logos": "LOGOS",
    "6-illustration": "ILLUSTRATION",
    "7-animation": "ANIMATION",
    "8-display": "DISPLAY"
}

def extract_title_from_filename(filename):
    """
    Extract title from filename like '1-pivotpoint.jpg' -> 'PIVOT POINT'
    or '1-elle.jpg' -> 'ELLE'
    """
    # Remove extension
    name = Path(filename).stem

    # Remove number prefix (e.g., '1-', '2a-')
    name = re.sub(r'^\d+[a-z]?-', '', name)

    # Replace dashes and underscores with spaces
    name = name.replace('-', ' ').replace('_', ' ')

    # Convert to title case and then uppercase
    return name.upper()

def scan_category_folder(category_path, category_key):
    """
    Scan a category folder and return list of images with titles
    """
    images = []

    if not os.path.exists(category_path):
        print(f"  Warning: {category_path} not found")
        return images

    # Get all jpg files and sort them naturally (1, 2, 3, not 1, 10, 2)
    files = [f for f in os.listdir(category_path) if f.lower().endswith('.jpg')]

    # Natural sort by the number prefix
    def natural_sort_key(filename):
        # Extract number from filename like '1-name.jpg' or '2a-name.jpg'
        match = re.match(r'^(\d+)[a-z]?-', filename)
        if match:
            return int(match.group(1))
        return 0

    files.sort(key=natural_sort_key)

    for filename in files:
        title = extract_title_from_filename(filename)
        image_path = f"images/mobile-covers/{category_key}/{filename}"
        images.append({
            'title': title,
            'path': image_path,
            'alt': title.title()
        })

    return images

def generate_carousel_html(category_key, category_name, images):
    """
    Generate HTML for a single carousel
    """
    if not images:
        return ""

    category_id = category_name.lower().replace(' ', '-')
    first_title = images[0]['title']

    html = f'    <!-- Mobile Carousel - {category_name} -->\n'
    html += f'    <div class="mobile-carousel" data-category="{category_id}">\n'
    html += '        <div class="carousel-track">\n'

    for img in images:
        html += f'            <div class="carousel-slide" data-title="{img["title"]}">\n'
        html += f'                <img src="{img["path"]}" alt="{img["alt"]}">\n'
        html += '            </div>\n'

    html += '        </div>\n'
    html += '        <div class="carousel-overlay">\n'
    html += f'            <div class="carousel-category">{category_name}</div>\n'
    html += f'            <div class="carousel-title" id="carousel-section-title-{category_id}">{first_title}</div>\n'
    html += '        </div>\n'
    html += '    </div>\n'

    return html

def generate_all_carousels():
    """
    Generate HTML for all carousels
    """
    print("Scanning mobile covers directory...")

    all_carousels_html = ""

    for category_key in sorted(CATEGORIES.keys()):
        category_name = CATEGORIES[category_key]
        category_path = os.path.join(MOBILE_COVERS_BASE, category_key)

        print(f"  Processing {category_name}...")
        images = scan_category_folder(category_path, category_key)

        if images:
            print(f"    Found {len(images)} images")
            carousel_html = generate_carousel_html(category_key, category_name, images)
            all_carousels_html += carousel_html + "\n"
        else:
            print(f"    No images found")

    return all_carousels_html

def update_index_html(carousels_html):
    """
    Update index.html with new carousel HTML
    """
    index_file = "index.html"

    if not os.path.exists(index_file):
        print(f"Error: {index_file} not found")
        return False

    print(f"\nUpdating {index_file}...")

    with open(index_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the carousels container section
    # Pattern: <!-- Mobile Carousels Container --> to </div> <!-- End mobile-carousels-container -->
    pattern = r'(<!-- Mobile Carousels Container -->\n    <div class="mobile-carousels-container">\n)(.*?)(    </div> <!-- End mobile-carousels-container -->)'

    match = re.search(pattern, content, re.DOTALL)

    if not match:
        print("Error: Could not find mobile carousels container in index.html")
        return False

    # Replace the carousel content
    new_content = content[:match.start(2)] + carousels_html + content[match.end(2):]

    # Write back to file
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"✓ Updated {index_file}")
    return True

def main():
    """
    Main function
    """
    print("Mobile Carousel Generator")
    print("=" * 50)

    # Generate carousel HTML
    carousels_html = generate_all_carousels()

    if not carousels_html:
        print("\nNo carousels generated. Check your mobile-covers directory.")
        return

    # Update index.html
    if update_index_html(carousels_html):
        print("\n" + "=" * 50)
        print("✓ Mobile carousels regenerated successfully!")
        print("\nThe carousels in index.html have been updated to match")
        print("the current files and order in images/mobile-covers/")
    else:
        print("\n✗ Failed to update index.html")

if __name__ == '__main__':
    main()
