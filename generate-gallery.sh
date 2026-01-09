#!/bin/bash

# Gallery Generator Script
# Scans the images/gallery folder and generates gallery-data.json
# Supports: images (jpg, jpeg, png, gif, webp, svg) and videos (mp4, mov)

GALLERY_BASE="images/gallery"
OUTPUT_FILE="gallery-data.json"

# Create gallery directory if it doesn't exist
if [ ! -d "$GALLERY_BASE" ]; then
    echo "Creating images/gallery folder structure..."
    mkdir -p "$GALLERY_BASE/magazines/ellegirl"
    mkdir -p "$GALLERY_BASE/magazines/elle"
    mkdir -p "$GALLERY_BASE/magazines/cosmo"
    mkdir -p "$GALLERY_BASE/illustration"
    echo "Created folder structure. Add your images and run this script again."
    exit 0
fi

echo "Scanning gallery directory..."

# Function to list image and video files in a directory
list_images() {
    local dir="$1"
    find "$dir" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" -o -iname "*.svg" -o -iname "*.mp4" -o -iname "*.mov" \) ! -name "*_thumb.jpg" | sort
}

# Start JSON
echo "{" > "$OUTPUT_FILE"
echo '  "projects": {' >> "$OUTPUT_FILE"

first_project=true

# Scan each project folder
for project_dir in "$GALLERY_BASE"/*; do
    if [ -d "$project_dir" ]; then
        project_name=$(basename "$project_dir")

        if [ "$first_project" = false ]; then
            echo "," >> "$OUTPUT_FILE"
        fi
        first_project=false

        echo "    \"$project_name\": {" >> "$OUTPUT_FILE"
        echo '      "sections": {' >> "$OUTPUT_FILE"

        first_section=true

        # Check if project has subsections (subdirectories)
        has_subdirs=false
        for item in "$project_dir"/*; do
            if [ -d "$item" ]; then
                has_subdirs=true
                break
            fi
        done

        if [ "$has_subdirs" = true ]; then
            # Has subsections
            for section_dir in "$project_dir"/*; do
                if [ -d "$section_dir" ]; then
                    section_name=$(basename "$section_dir")

                    if [ "$first_section" = false ]; then
                        echo "," >> "$OUTPUT_FILE"
                    fi
                    first_section=false

                    echo "        \"$section_name\": {" >> "$OUTPUT_FILE"
                    echo '          "images": [' >> "$OUTPUT_FILE"

                    # List images
                    first_image=true
                    while IFS= read -r img; do
                        if [ -n "$img" ]; then
                            if [ "$first_image" = false ]; then
                                echo "," >> "$OUTPUT_FILE"
                            fi
                            first_image=false
                            echo -n "            \"$img\"" >> "$OUTPUT_FILE"
                        fi
                    done < <(list_images "$section_dir")

                    echo "" >> "$OUTPUT_FILE"
                    echo "          ]" >> "$OUTPUT_FILE"
                    echo -n "        }" >> "$OUTPUT_FILE"
                fi
            done
        else
            # No subsections, images directly in project folder
            echo "        \"main\": {" >> "$OUTPUT_FILE"
            echo '          "images": [' >> "$OUTPUT_FILE"

            first_image=true
            while IFS= read -r img; do
                if [ -n "$img" ]; then
                    if [ "$first_image" = false ]; then
                        echo "," >> "$OUTPUT_FILE"
                    fi
                    first_image=false
                    echo -n "            \"$img\"" >> "$OUTPUT_FILE"
                fi
            done < <(list_images "$project_dir")

            echo "" >> "$OUTPUT_FILE"
            echo "          ]" >> "$OUTPUT_FILE"
            echo -n "        }" >> "$OUTPUT_FILE"
        fi

        echo "" >> "$OUTPUT_FILE"
        echo "      }" >> "$OUTPUT_FILE"
        echo -n "    }" >> "$OUTPUT_FILE"
    fi
done

echo "" >> "$OUTPUT_FILE"
echo "  }" >> "$OUTPUT_FILE"
echo "}" >> "$OUTPUT_FILE"

# Count total media files (images + videos, excluding thumbnails)
total_media=$(find "$GALLERY_BASE" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" -o -iname "*.svg" -o -iname "*.mp4" -o -iname "*.mov" \) ! -name "*_thumb.jpg" | wc -l)

echo "✓ Gallery data generated: $OUTPUT_FILE"
echo "  Found $total_media media files (images + videos)"
echo "  Run this script whenever you add/remove images or videos from the gallery."
