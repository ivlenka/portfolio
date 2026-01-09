#!/bin/bash

# Generate Video Thumbnails Script
# Creates thumbnail preview images for all videos in the gallery
# Thumbnails are extracted from the middle of each video

echo "=== Video Thumbnail Generator ==="
echo ""

# Check if ffmpeg is available
if ! command -v /opt/homebrew/bin/ffmpeg &> /dev/null; then
    echo "Error: ffmpeg not found"
    echo "Install with: brew install ffmpeg"
    exit 1
fi

echo "Scanning for videos in images/gallery..."
echo ""

total=0
created=0
skipped=0

# Find all video files in gallery
find "images/gallery" -type f \( -iname "*.mp4" -o -iname "*.mov" \) | while read video; do
    total=$((total + 1))
    
    # Get directory and filename
    dir=$(dirname "$video")
    filename=$(basename "$video")
    name="${filename%.*}"
    thumbnail="${dir}/${name}_thumb.jpg"
    
    # Skip if thumbnail already exists
    if [ -f "$thumbnail" ]; then
        echo "✓ Skip (exists): $filename"
        skipped=$((skipped + 1))
        continue
    fi
    
    echo "→ Creating thumbnail: $filename"
    
    # Get video duration
    duration=$(/opt/homebrew/bin/ffmpeg -i "$video" 2>&1 | grep "Duration" | awk '{print $2}' | tr -d , | awk -F: '{print ($1 * 3600) + ($2 * 60) + $3}')
    
    # Calculate middle timestamp
    middle=$(echo "$duration / 2" | bc -l)
    
    # Extract frame from middle of video at 640px width
    /opt/homebrew/bin/ffmpeg -ss "$middle" -i "$video" \
        -vframes 1 \
        -vf "scale=640:-1" \
        -q:v 2 \
        -y \
        "$thumbnail" 2>&1 > /dev/null
    
    if [ -f "$thumbnail" ]; then
        size=$(du -h "$thumbnail" | awk '{print $1}')
        echo "  ✓ Created: ${name}_thumb.jpg ($size)"
        created=$((created + 1))
    else
        echo "  ✗ Failed"
    fi
done

echo ""
echo "=== Summary ==="
echo "Total thumbnails: $(find images/gallery -name "*_thumb.jpg" | wc -l | xargs)"
echo ""
echo "Note: Run ./generate-gallery.sh to update gallery-data.json"
