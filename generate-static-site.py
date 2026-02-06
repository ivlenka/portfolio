#!/usr/bin/env python3
"""
Static Site Generator for Portfolio
Generates static HTML files for each project page with pre-calculated layouts
Uses text-content.json for all text descriptions
"""

import json
import os
from pathlib import Path

# Load text content from external file
def load_text_content():
    with open('text-content.json', 'r', encoding='utf-8') as f:
        return json.load(f)

TEXT_CONTENT = load_text_content()

# Project metadata (gallery keys and category names)
PROJECTS = {
    'brands': {
        'category': 'BRANDS',
        'gallery_key': '1-brands'
    },
    'magazines': {
        'category': 'MAGAZINES',
        'gallery_key': '2-magazines'
    },
    'prints': {
        'category': 'PRINTS',
        'gallery_key': '3-print'
    },
    'digital': {
        'category': 'DIGITAL',
        'gallery_key': '4-digital'
    },
    'logos': {
        'category': 'LOGOS',
        'gallery_key': '5-logos'
    },
    'illustration': {
        'category': 'ILLUSTRATION',
        'gallery_key': '6-illustrations'
    },
    'animation': {
        'category': 'ANIMATION',
        'gallery_key': '7-animation'
    },
    'unsorted': {
        'category': 'DISPLAY',
        'gallery_key': '8-display'
    }
}

# Section configurations
SECTION_CONFIGS = {
    'brands': {},
    'magazines': {},
    'prints': {},
    'digital': {},
    'logos': {},
    'illustration': {},
    'animation': {
        '4-leaky people': {
            'customLayout': True,
            'rows': [
                {'count': 1, 'fullWidth': True},  # Row 1: video full width
                {'count': 4},  # Row 2: 4 images
                {'count': 5}   # Row 3: 5 images
            ]
        }
    },
    'unsorted': {
        'main': {'showAllRows': True, 'firstRowImageCount': 2}
    }
}

def get_image_size(image_path, is_last_in_section=False):
    """Get image dimensions from thumbnail using sips"""
    import subprocess
    import re

    # Use thumbnail for dimensions
    base_path = image_path.rsplit('.', 1)[0]
    # Use higher quality thumbnail (1000px) for last image in section
    thumbnail_suffix = '_thumb1000.jpg' if is_last_in_section else '_thumb.jpg'
    thumb_path = f"{base_path}{thumbnail_suffix}"

    # Try thumbnail first, then original
    for path in [thumb_path, image_path]:
        if os.path.exists(path):
            try:
                result = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', path],
                                       capture_output=True, text=True, timeout=5)
                if result.returncode == 0:
                    # Parse output: "pixelWidth: 1234"
                    width_match = re.search(r'pixelWidth:\s+(\d+)', result.stdout)
                    height_match = re.search(r'pixelHeight:\s+(\d+)', result.stdout)
                    if width_match and height_match:
                        return (int(width_match.group(1)), int(height_match.group(1)))
            except Exception as e:
                print(f"  Warning: Could not get size for {path}: {e}")
                pass

    # Default dimensions if we can't get actual size
    return (1200, 800)

def create_bin_packed_layout(images, container_width=1000, target_row_height=300, gap=10, min_images_per_row=3, section_options=None):
    """Create bin-packed layout from images"""
    section_options = section_options or {}
    rows = []
    current_row = []
    image_index = 0

    # Handle custom layout (e.g., leaky people section)
    if section_options.get('customLayout') and section_options.get('rows'):
        custom_rows = section_options['rows']

        for row_config in custom_rows:
            if image_index >= len(images):
                break

            row_count = row_config.get('count', 1)
            is_full_width = row_config.get('fullWidth', False)
            current_row = []

            for i in range(row_count):
                if image_index < len(images):
                    img = images[image_index]
                    aspect_ratio = img['width'] / img['height']
                    scaled_width = target_row_height * aspect_ratio
                    img['scaledWidth'] = scaled_width
                    current_row.append(img)
                    image_index += 1

            if current_row:
                rows.append(normalize_row(current_row, container_width, target_row_height, gap))

        # Process any remaining images with normal bin packing
        current_row = []
        current_row_width = 0
        for i in range(image_index, len(images)):
            img = images[i]
            aspect_ratio = img['width'] / img['height']
            scaled_width = target_row_height * aspect_ratio
            img['scaledWidth'] = scaled_width

            if len(current_row) < min_images_per_row:
                current_row.append(img)
                current_row_width += scaled_width
            elif current_row_width + scaled_width + (len(current_row) * gap) <= container_width:
                current_row.append(img)
                current_row_width += scaled_width
            else:
                if current_row:
                    rows.append(normalize_row(current_row, container_width, target_row_height, gap))
                current_row = [img]
                current_row_width = scaled_width

        if current_row:
            rows.append(normalize_row(current_row, container_width, target_row_height, gap))

        return rows

    # Handle first row with custom image count
    if section_options.get('firstRowImageCount') and len(images) >= section_options['firstRowImageCount']:
        first_row_count = section_options['firstRowImageCount']
        first_image_large = section_options.get('firstImageLarge', False)

        # If firstImageLarge, separate videos from first image row
        if first_image_large:
            # First, render all videos in their own rows
            while image_index < len(images) and images[image_index].get('isVideo'):
                img = images[image_index]
                aspect_ratio = img['width'] / img['height']
                scaled_width = target_row_height * aspect_ratio
                img['scaledWidth'] = scaled_width
                rows.append(normalize_row([img], container_width, target_row_height, gap))
                image_index += 1

            # Then render first non-video image(s) in full width row
            for i in range(first_row_count):
                if image_index + i < len(images):
                    img = images[image_index + i]
                    aspect_ratio = img['width'] / img['height']
                    scaled_width = target_row_height * aspect_ratio
                    img['scaledWidth'] = scaled_width
                    current_row.append(img)

            if current_row:
                rows.append(normalize_row(current_row, container_width, target_row_height, gap))
                current_row = []
                image_index += first_row_count
        else:
            # Original behavior - include all items in first row
            for i in range(min(first_row_count, len(images))):
                img = images[i]
                aspect_ratio = img['width'] / img['height']
                scaled_width = target_row_height * aspect_ratio
                img['scaledWidth'] = scaled_width
                current_row.append(img)

            rows.append(normalize_row(current_row, container_width, target_row_height, gap))
            current_row = []
            image_index = first_row_count

    # Process remaining images
    current_row_width = 0
    for i in range(image_index, len(images)):
        img = images[i]
        aspect_ratio = img['width'] / img['height']
        scaled_width = target_row_height * aspect_ratio
        img['scaledWidth'] = scaled_width

        if len(current_row) < min_images_per_row:
            current_row.append(img)
            current_row_width += scaled_width
        elif current_row_width + scaled_width + (len(current_row) * gap) <= container_width:
            current_row.append(img)
            current_row_width += scaled_width
        else:
            if current_row:
                rows.append(normalize_row(current_row, container_width, target_row_height, gap))
            current_row = [img]
            current_row_width = scaled_width

    if current_row:
        rows.append(normalize_row(current_row, container_width, target_row_height, gap))

    return rows

def normalize_row(row, container_width, target_row_height, gap):
    """Normalize row to fit container width"""
    total_gap = (len(row) - 1) * gap
    available_width = container_width - total_gap
    total_width = sum(img['scaledWidth'] for img in row)
    scale = available_width / total_width

    normalized_row = []
    for img in row:
        normalized_img = img.copy()
        normalized_img['width'] = img['scaledWidth'] * scale
        normalized_img['height'] = target_row_height * scale
        normalized_row.append(normalized_img)

    return normalized_row

def render_gallery_html(rows, gap=10, section_id='', is_animation_project=False, section_options=None):
    """Render gallery HTML from layout rows"""
    section_options = section_options or {}
    visible_rows = len(rows) if section_options.get('showAllRows') else 3

    html = '<div class="bin-packed-layout">\n'

    for row_index, row in enumerate(rows):
        is_hidden = row_index >= visible_rows and len(rows) > visible_rows
        hidden_class = ' hidden-row' if is_hidden else ''
        html += f'<div class="bin-packed-row{hidden_class}" style="margin-bottom: {gap}px;" data-section="{section_id}">\n'

        for img_index, img in enumerate(row):
            is_video = img['src'].lower().endswith('.mp4')

            # Check for specific video types
            is_pivot_point_video = '3-pivotpoint' in img['src'] and ('5-PP-sm_blue.mp4' in img['src'] or '8a-PP-sm_pink2.mp4' in img['src'])
            is_ost_video = '1-OST' in img['src'] and '1c-Untitled_Artwork 2.mp4' in img['src']
            is_monster_bow_video = '3-monster-bow' in img['src'] and is_video

            animation_class = ' animation-video' if (is_animation_project or is_pivot_point_video or is_ost_video or is_monster_bow_video) else ''
            autoplay_attr = ' autoplay' if (is_pivot_point_video or is_ost_video or is_monster_bow_video) else ''

            margin_right = gap if img_index < len(row) - 1 else 0

            if is_video:
                video_path = img['src'].rsplit('.', 1)[0]
                # Use 1000px thumbnail for first video item (if configured)
                poster_suffix = '_thumb1000.jpg' if img.get('isFirstItemInSection') else '_thumb.jpg'
                poster_path = f"{video_path}{poster_suffix}"
                media_element = f'''<video poster="{poster_path}" style="width: {img["width"]}px; height: {img["height"]}px; object-fit: cover; display: block;" muted loop playsinline{autoplay_attr} data-has-audio="false" preload="metadata">
                    <source src="{img["src"]}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>'''
            else:
                image_path = img['src'].rsplit('.', 1)[0]
                # Use 1000px thumbnail for last image
                thumbnail_suffix = '_thumb1000.jpg' if img.get('isLastInSection') else '_thumb.jpg'
                thumbnail_path = f"{image_path}{thumbnail_suffix}"
                media_element = f'<img src="{thumbnail_path}" data-full-src="{img["src"]}" alt="{img.get("alt", "")}" style="width: {img["width"]}px; height: {img["height"]}px; object-fit: cover; display: block;" loading="lazy">'

            overlay_html = ''
            if not (is_animation_project or is_pivot_point_video or is_ost_video or is_monster_bow_video) or not is_video:
                overlay_html = f'''<div class="gallery-image-overlay">
                    <div class="gallery-image-description">{img.get("description", img.get("alt", ""))}</div>
                </div>'''

            sound_button_html = ''
            needs_inverted = '0-effect_match_olenakovtash' in img['src'] or '3-neveralone_nocopyright' in img['src'] or 'LeakyPeople_final_low' in img['src']
            inverted_class = ' inverted' if needs_inverted else ''
            is_testarossa_video = 'testarossa-winery' in img['src']

            if (is_animation_project or is_pivot_point_video or is_ost_video or is_monster_bow_video) and is_video and not is_testarossa_video:
                sound_button_html = f'''<button class="sound-toggle-btn{inverted_class}" data-muted="true" style="display: none;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                        <path class="sound-on-indicator" d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke-width="2"/>
                        <path class="sound-on-indicator" d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke-width="2"/>
                        <line class="sound-off-indicator" x1="23" y1="9" x2="17" y2="15" stroke-width="2"/>
                        <line class="sound-off-indicator" x1="17" y1="9" x2="23" y2="15" stroke-width="2"/>
                    </svg>
                </button>'''

            html += f'''<div class="gallery-image-wrapper{animation_class}" style="margin-right: {margin_right}px; cursor: pointer;" data-index="{img["index"]}">
                {media_element}
                {overlay_html}
                {sound_button_html}
            </div>\n'''

        html += '</div>\n'

    html += '</div>\n'

    # Add "See more" button if needed
    if len(rows) > visible_rows:
        html += f'<div class="see-more-container"><button class="see-more-btn" data-section="{section_id}">See more</button></div>\n'

    return html

def generate_project_page(project_id, project_info, gallery_data):
    """Generate a static HTML page for a project"""
    print(f"Generating page for {project_id}...")

    # Get text content for this project
    project_text = TEXT_CONTENT['projects'].get(project_id, {})
    project_title = project_text.get('title', project_id.title())
    project_description = project_text.get('description', '')

    gallery_key = project_info['gallery_key']
    project_data = gallery_data['projects'].get(gallery_key)

    if not project_data:
        print(f"  Warning: No gallery data found for {gallery_key}")
        return

    # Build sections
    all_images = []
    sections_html = []
    image_index = 0

    is_animation_project = project_id == 'animation'

    for section_key, section_data in project_data['sections'].items():
        images = []

        # Get section text content for image descriptions
        section_text = project_text.get('sections', {}).get(section_key, {})

        # Build image description lookup by filename
        image_descriptions = {}
        for img_entry in section_text.get('images', []):
            image_descriptions[img_entry['file']] = img_entry.get('description', '')

        # Get section options first to check for special configurations
        section_options = SECTION_CONFIGS.get(project_id, {}).get(section_key, {})
        custom_layout = section_options.get('customLayout', False)

        for idx, img_src in enumerate(section_data['images']):
            is_video = img_src.lower().endswith('.mp4')

            # For custom layout, check if this is the first item (video should use large thumb)
            is_first_item = False
            if custom_layout and idx == 0:
                is_first_item = True

            # Check if this is the last image in the section
            is_last = (idx == len(section_data['images']) - 1)

            # Use large thumbnail for first item in custom layout or last image
            use_large_thumb = is_first_item or (is_last and not custom_layout)
            width, height = get_image_size(img_src, is_last_in_section=use_large_thumb)

            # Get description for this image by filename
            filename = os.path.basename(img_src)
            description = image_descriptions.get(filename, '')

            img_obj = {
                'src': img_src,
                'width': width,
                'height': height,
                'isVideo': is_video,
                'alt': '',
                'description': description,
                'index': image_index
            }

            # Mark special images
            if is_first_item:
                img_obj['isFirstItemInSection'] = True
            if is_last and not custom_layout:
                img_obj['isLastInSection'] = True

            images.append(img_obj)
            all_images.append(img_obj)
            image_index += 1

        # Section options already retrieved above

        # Get section title and description (section_text already retrieved above)
        section_title = section_text.get('title', section_key.split('-', 1)[-1].replace('-', ' ').title())
        section_description = section_text.get('description', '')

        # For backward compatibility, use section_title as section_name
        section_name = section_title

        # Layout configuration
        min_images_per_row = 3
        target_row_height = 300

        if section_name == 'Elle' or section_name == 'Three Stories':
            min_images_per_row = 2
        elif section_name == 'Food':
            min_images_per_row = 8
            target_row_height = 120

        if section_options.get('targetRowHeight'):
            target_row_height = section_options['targetRowHeight']

        # Create layout
        rows = create_bin_packed_layout(images, container_width=1000, target_row_height=target_row_height,
                                       gap=10, min_images_per_row=min_images_per_row, section_options=section_options)

        # Render section
        gallery_html = render_gallery_html(rows, gap=10, section_id=section_key,
                                          is_animation_project=is_animation_project, section_options=section_options)

        # Only show description if it exists
        description_html = f'<p class="project-description">{section_description}</p>' if section_description else ''

        section_html = f'''<div class="gallery-section">
    <h2 class="project-title">{section_title}</h2>
    {description_html}
    {gallery_html}
</div>
'''
        sections_html.append(section_html)

    # Create lightbox images array as JSON
    lightbox_images_json = json.dumps(all_images, indent=2)

    # Add mobile animation scripts for animation project
    animation_scripts = '''<script src="mobile-animation-play.js"></script>
    <script src="mobile-animation-gifs.js"></script>''' if is_animation_project else ''

    # Generate complete HTML
    html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{project_title} - OLENA KOVTASH</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="project-styles.css">
</head>
<body>
    <!-- Mobile Header -->
    <header class="mobile-header">
        <div class="mobile-header-top">
            <div class="mobile-logo-section">
                <a href="index.html">
                    <img src="images/logo5.png" alt="Logo" class="mobile-logo">
                </a>
                <span class="mobile-name">OLENA KOVTASH</span>
            </div>
            <div class="mobile-subtitle-section">
                <div class="mobile-subtitle-line">VISUAL</div>
                <div class="mobile-subtitle-line">DESIGNER</div>
            </div>
            <div class="mobile-header-icons">
                <a href="contact.html">
                    <img src="images/contacts.png" alt="Contact" class="mobile-contact-icon">
                </a>
                <div class="mobile-menu-icon" id="mobile-menu-toggle">
                    <span></span>
                </div>
            </div>
        </div>
        <div class="mobile-burger-menu" id="mobile-burger-menu">
            <a href="index.html">Home</a>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
            <div class="mobile-menu-divider">PROJECTS</div>
            <a href="project-brands.html"{"" if project_id != "brands" else ' class="active"'}>Brands</a>
            <a href="project-magazines.html"{"" if project_id != "magazines" else ' class="active"'}>Magazines</a>
            <a href="project-prints.html"{"" if project_id != "prints" else ' class="active"'}>Prints</a>
            <a href="project-digital.html"{"" if project_id != "digital" else ' class="active"'}>Digital</a>
            <a href="project-logos.html"{"" if project_id != "logos" else ' class="active"'}>Logos</a>
            <a href="project-illustration.html"{"" if project_id != "illustration" else ' class="active"'}>Illustration</a>
            <a href="project-animation.html"{"" if project_id != "animation" else ' class="active"'}>Animation</a>
            <a href="project-unsorted.html"{"" if project_id != "unsorted" else ' class="active"'}>Display</a>
        </div>
        <div class="mobile-menu-overlay" id="mobile-menu-overlay"></div>
        <div class="mobile-nav-wrapper">
            <nav class="mobile-nav">
                <a href="project-brands.html"{"" if project_id != "brands" else ' class="active"'}>BRANDS</a>
                <a href="project-magazines.html"{"" if project_id != "magazines" else ' class="active"'}>MAGAZINES</a>
                <a href="project-prints.html"{"" if project_id != "prints" else ' class="active"'}>PRINTS</a>
                <a href="project-digital.html"{"" if project_id != "digital" else ' class="active"'}>DIGITAL</a>
                <a href="project-logos.html"{"" if project_id != "logos" else ' class="active"'}>LOGOS</a>
                <a href="project-illustration.html"{"" if project_id != "illustration" else ' class="active"'}>ILLUSTRATION</a>
                <a href="project-animation.html"{"" if project_id != "animation" else ' class="active"'}>ANIMATION</a>
                <a href="project-unsorted.html"{"" if project_id != "unsorted" else ' class="active"'}>DISPLAY</a>
            </nav>
        </div>
    </header>

    <div class="container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="logo-section">
                <a href="index.html">
                    <img src="images/logo5.png" alt="Logo" class="logo">
                </a>
                <h1 class="name">OLENA KOVTASH</h1>
                <p class="designer-subtitle">visual designer</p>
                <nav class="top-nav">
                    <a href="about.html">About</a>
                    <a href="contact.html">Contact</a>
                </nav>
            </div>

            <div class="projects-menu">
                <h2>PROJECTS</h2>
                <nav class="project-links">
                    <a href="project-brands.html"{"" if project_id != "brands" else ' class="active"'}>Brands</a>
                    <a href="project-magazines.html"{"" if project_id != "magazines" else ' class="active"'}>Magazines</a>
                    <a href="project-prints.html"{"" if project_id != "prints" else ' class="active"'}>Prints</a>
                    <a href="project-digital.html"{"" if project_id != "digital" else ' class="active"'}>Digital</a>
                    <a href="project-logos.html"{"" if project_id != "logos" else ' class="active"'}>Logos</a>
                    <a href="project-illustration.html"{"" if project_id != "illustration" else ' class="active"'}>Illustration</a>
                    <a href="project-animation.html"{"" if project_id != "animation" else ' class="active"'}>Animation</a>
                    <a href="project-unsorted.html"{"" if project_id != "unsorted" else ' class="active"'}>Display</a>
                </nav>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <div class="project-header">
                <h3 class="project-category" id="categoryTitle">{project_info['category']}</h3>
            </div>

            <div class="project-images">
{''.join(sections_html)}
            </div>
        </main>
    </div>

    <!-- Lightbox -->
    <div class="lightbox" id="lightbox">
        <button class="lightbox-close" id="lightboxClose">&times;</button>
        <button class="lightbox-arrow prev" id="lightboxPrev">&#8249;</button>
        <div class="lightbox-content">
            <div class="lightbox-image-wrapper">
                <img id="lightboxImage" src="" alt="">
                <div class="lightbox-description" id="lightboxDescription"></div>
            </div>
        </div>
        <button class="lightbox-arrow next" id="lightboxNext">&#8250;</button>
    </div>

    <script src="mobile-menu.js"></script>
    <script src="mobile-menu-alignment.js"></script>
    <script src="mobile-project-gallery.js"></script>
    {animation_scripts}
    <script src="lightbox.js"></script>
    <script src="image-protection.js"></script>
    <script>
        // Initialize lightbox with pre-generated image data
        var lightboxImages = {lightbox_images_json};
        initLightbox(lightboxImages);
    </script>
</body>
</html>
'''

    # Write to file
    output_file = f"project-{project_id}.html"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"  ✓ Generated {output_file}")

def main():
    """Main function to generate all static pages"""
    print("Portfolio Static Site Generator")
    print("=" * 50)

    # Load gallery data
    with open('gallery-data.json', 'r', encoding='utf-8') as f:
        gallery_data = json.load(f)

    # Generate each project page
    for project_id, project_info in PROJECTS.items():
        generate_project_page(project_id, project_info, gallery_data)

    print("\n" + "=" * 50)
    print("✓ All static pages generated successfully!")
    print("\nGenerated files:")
    for project_id in PROJECTS.keys():
        print(f"  - project-{project_id}.html")

if __name__ == '__main__':
    main()
