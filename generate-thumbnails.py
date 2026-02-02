#!/usr/bin/env python3
"""
Thumbnail Generator for Portfolio Gallery
Creates 600px thumbnails for all images and 1000px for the last image in each folder
"""

import os
import subprocess
from pathlib import Path

# Configuration
GALLERY_BASE = "images/gallery"
THUMBNAIL_SIZE = 600  # Width in pixels for regular thumbnails
LAST_IMAGE_SIZE = 1000  # Width in pixels for last image in each folder
THUMBNAIL_SUFFIX = "_thumb.jpg"
LAST_IMAGE_SUFFIX = "_thumb1000.jpg"

def get_image_files(folder_path):
    """Get all original image files (not thumbnails) from a folder, sorted"""
    image_extensions = {'.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'}
    files = []

    for file in sorted(os.listdir(folder_path)):
        if any(file.endswith(ext) for ext in image_extensions):
            # Skip thumbnail files (both _thumb.jpg and _thumb1000.jpg)
            if '_thumb' not in file:
                files.append(file)

    return files

def create_thumbnail(input_path, output_path, width):
    """Create a thumbnail with specified width, maintaining aspect ratio"""
    try:
        # Use sips (macOS built-in image tool) to resize
        # --resampleWidth maintains aspect ratio
        cmd = [
            'sips',
            '--resampleWidth', str(width),
            input_path,
            '--out', output_path
        ]

        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)

        if result.returncode == 0:
            return True
        else:
            print(f"  Error: {result.stderr}")
            return False

    except Exception as e:
        print(f"  Exception: {e}")
        return False

def process_folder(folder_path):
    """Process all images in a folder"""
    image_files = get_image_files(folder_path)

    if not image_files:
        return 0

    folder_name = os.path.basename(folder_path)
    print(f"\nProcessing folder: {folder_name} ({len(image_files)} images)")

    processed = 0

    for i, image_file in enumerate(image_files):
        is_last = (i == len(image_files) - 1)

        # Determine thumbnail size
        thumb_size = LAST_IMAGE_SIZE if is_last else THUMBNAIL_SIZE

        # Build paths
        input_path = os.path.join(folder_path, image_file)

        # Create thumbnail name (remove original extension, add appropriate suffix)
        base_name = os.path.splitext(image_file)[0]
        suffix = LAST_IMAGE_SUFFIX if is_last else THUMBNAIL_SUFFIX
        thumb_name = f"{base_name}{suffix}"
        output_path = os.path.join(folder_path, thumb_name)

        # Create thumbnail
        size_label = "LAST" if is_last else "regular"
        print(f"  [{i+1}/{len(image_files)}] {image_file} -> {thumb_name} ({thumb_size}px, {size_label})")

        if create_thumbnail(input_path, output_path, thumb_size):
            processed += 1
        else:
            print(f"    Failed to create thumbnail")

    return processed

def main():
    """Main function to process all gallery folders"""
    print("=" * 60)
    print("Portfolio Thumbnail Generator")
    print("=" * 60)
    print(f"Regular thumbnails: {THUMBNAIL_SIZE}px width")
    print(f"Last image thumbnails: {LAST_IMAGE_SIZE}px width")
    print(f"Gallery base: {GALLERY_BASE}")

    if not os.path.exists(GALLERY_BASE):
        print(f"\nError: Gallery base directory not found: {GALLERY_BASE}")
        return

    total_processed = 0
    total_folders = 0

    # Iterate through category folders (1-brands, 2-magazines, etc.)
    for category_folder in sorted(os.listdir(GALLERY_BASE)):
        category_path = os.path.join(GALLERY_BASE, category_folder)

        if not os.path.isdir(category_path) or category_folder.startswith('.'):
            continue

        print(f"\n{'='*60}")
        print(f"Category: {category_folder}")
        print(f"{'='*60}")

        # Iterate through project folders within each category
        for project_folder in sorted(os.listdir(category_path)):
            project_path = os.path.join(category_path, project_folder)

            if not os.path.isdir(project_path) or project_folder.startswith('.'):
                continue

            processed = process_folder(project_path)
            total_processed += processed
            total_folders += 1

    print("\n" + "=" * 60)
    print(f"Complete! Processed {total_processed} images across {total_folders} folders")
    print("=" * 60)

if __name__ == "__main__":
    main()
