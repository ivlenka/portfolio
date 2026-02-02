#!/bin/bash

# Portfolio Gallery Rebuild Script
# Runs all generation scripts in the correct order
# Use this when adding new images, renaming, or reordering

echo "=========================================="
echo "Portfolio Gallery Rebuild"
echo "=========================================="
echo ""

# Step 1: Update gallery data
echo "Step 1/3: Updating gallery-data.json..."
echo "------------------------------------------"
./generate-gallery.sh
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to update gallery data"
    exit 1
fi
echo "✓ Gallery data updated"
echo ""

# Step 2: Generate thumbnails
echo "Step 2/3: Generating thumbnails..."
echo "------------------------------------------"
./generate-thumbnails.py
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to generate thumbnails"
    exit 1
fi
echo "✓ Thumbnails generated"
echo ""

# Step 3: Generate static site
echo "Step 3/3: Generating static HTML pages..."
echo "------------------------------------------"
./generate-static-site.py
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to generate static site"
    exit 1
fi
echo "✓ Static pages generated"
echo ""

echo "=========================================="
echo "✓ Gallery rebuild complete!"
echo "=========================================="
echo ""
echo "Your portfolio is ready to view."
echo "Run: python -m http.server 8000"
echo "Then open: http://localhost:8000"
