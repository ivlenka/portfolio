#!/usr/bin/env python3
"""
Helper script to populate text-content.json with all images from gallery-data.json
This makes it easy to add descriptions for each image that will appear in lightbox mode
"""

import json
import os
from pathlib import Path

def get_filename_from_path(path):
    """Extract just the filename from full path"""
    return os.path.basename(path)

def populate_text_content():
    """Read gallery-data.json and create/update text-content.json with image entries"""

    # Load existing text-content.json
    with open('text-content.json', 'r', encoding='utf-8') as f:
        text_content = json.load(f)

    # Load gallery data
    with open('gallery-data.json', 'r', encoding='utf-8') as f:
        gallery_data = json.load(f)

    # Mapping from gallery keys to project IDs
    gallery_to_project = {
        '1-brands': 'brands',
        '2-magazines': 'magazines',
        '3-print': 'prints',
        '4-digital': 'digital',
        '5-logos': 'logos',
        '6-illustrations': 'illustration',
        '7-animation': 'animation',
        '8-display': 'unsorted'
    }

    # Process each project
    for gallery_key, project_data in gallery_data['projects'].items():
        project_id = gallery_to_project.get(gallery_key)
        if not project_id:
            continue

        # Get or create project entry
        if project_id not in text_content['projects']:
            text_content['projects'][project_id] = {
                'title': project_id.title(),
                'description': '',
                'sections': {}
            }

        project_text = text_content['projects'][project_id]

        # Process each section
        for section_key, section_data in project_data['sections'].items():
            # Get or create section entry
            if section_key not in project_text['sections']:
                section_name = section_key.split('-', 1)[-1].replace('-', ' ').title()
                project_text['sections'][section_key] = {
                    'title': section_name,
                    'description': '',
                    'images': []
                }

            section_text = project_text['sections'][section_key]

            # Create image entries if not exists
            if 'images' not in section_text:
                section_text['images'] = []

            # Build list of existing image descriptions (keyed by filename)
            existing_images = {}
            for img in section_text.get('images', []):
                existing_images[img['file']] = img.get('description', '')

            # Add all images from gallery-data
            section_text['images'] = []
            for img_path in section_data['images']:
                filename = get_filename_from_path(img_path)
                section_text['images'].append({
                    'file': filename,
                    'description': existing_images.get(filename, '')
                })

    # Write updated text-content.json
    with open('text-content.json', 'w', encoding='utf-8') as f:
        json.dump(text_content, f, indent=2, ensure_ascii=False)

    print("✓ text-content.json updated with all images!")
    print("\nYou can now add descriptions for each image.")
    print("These descriptions will appear in the lightbox when hovering over images.")

if __name__ == '__main__':
    populate_text_content()
