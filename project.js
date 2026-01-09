// Project data - you can customize this with your actual project information
const projects = {
    brands: {
        category: 'BRANDS',
        title: 'Testarossa Winery',
        description: 'Highlighted text groovinghighlighted groovinghighlighted groovinghighlighted groovinghighlighted groovinghighlighted groovinghighlighted groovinghighlighted groovinghighlighted groovinghighlighted grooving highlighted groovinghighlighted grooving highlighted grooving highlighted grooving'
    },
    magazines: {
        category: 'MAGAZINES',
        title: 'Magazine Design',
        description: 'Editorial design work featuring magazine layouts, cover designs, and fashion photography for Elle Girl, Elle, and Cosmopolitan publications.'
    },
    prints: {
        category: 'PRINTS',
        title: 'Project Name',
        description: 'Add your project description here. Describe what the project is about, your role, and any interesting details about the work you did.'
    },
    digital: {
        category: 'DIGITAL',
        title: 'Project Name',
        description: 'Add your project description here. Describe what the project is about, your role, and any interesting details about the work you did.'
    },
    logos: {
        category: 'LOGOS',
        title: 'Project Name',
        description: 'Add your project description here. Describe what the project is about, your role, and any interesting details about the work you did.'
    },
    illustration: {
        category: 'ILLUSTRATION',
        title: 'Comic Illustration',
        description: 'Original comic and illustration work featuring character designs, sequential storytelling, and narrative art exploring themes of friendship and adventure.'
    },
    animation: {
        category: 'ANIMATION',
        title: 'Animation Project',
        description: 'Add your project description here. Describe what the project is about, your role, and any interesting details about the work you did.'
    },
    unsorted: {
        category: 'UNSORTED',
        title: 'Unsorted Project',
        description: 'Add your project description here. Describe what the project is about, your role, and any interesting details about the work you did.'
    }
};

// Get project ID from URL
function getProjectId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || 'brands';
}

// Bin packing algorithm for optimal image layout
function createBinPackedLayout(images, containerWidth, targetRowHeight = 300, gap = 10, minImagesPerRow = 3) {
    const rows = [];
    let currentRow = [];
    let currentRowWidth = 0;

    images.forEach((img) => {
        const aspectRatio = img.width / img.height;
        const scaledWidth = targetRowHeight * aspectRatio;

        // Always add to current row if we have less than minimum images
        if (currentRow.length < minImagesPerRow) {
            currentRow.push({ ...img, scaledWidth });
            currentRowWidth += scaledWidth;
        } else if (currentRowWidth + scaledWidth + (currentRow.length * gap) <= containerWidth) {
            // After minimum, only add if it fits
            currentRow.push({ ...img, scaledWidth });
            currentRowWidth += scaledWidth;
        } else {
            // Start new row
            if (currentRow.length > 0) {
                rows.push(normalizeRow(currentRow, containerWidth, targetRowHeight, gap));
            }
            currentRow = [{ ...img, scaledWidth }];
            currentRowWidth = scaledWidth;
        }
    });

    if (currentRow.length > 0) {
        rows.push(normalizeRow(currentRow, containerWidth, targetRowHeight, gap));
    }

    return rows;
}

function normalizeRow(row, containerWidth, targetRowHeight, gap) {
    const totalGap = (row.length - 1) * gap;
    const availableWidth = containerWidth - totalGap;
    const totalWidth = row.reduce((sum, img) => sum + img.scaledWidth, 0);
    const scale = availableWidth / totalWidth;

    return row.map(img => ({
        ...img,
        width: img.scaledWidth * scale,
        height: targetRowHeight * scale
    }));
}

function renderBinPackedLayout(rows, gap = 10, sectionId = '') {
    const visibleRows = 3;
    let html = '<div class="bin-packed-layout">';

    rows.forEach((row, rowIndex) => {
        const isHidden = rowIndex >= visibleRows && rows.length > visibleRows;
        const hiddenClass = isHidden ? ' hidden-row' : '';
        html += `<div class="bin-packed-row${hiddenClass}" style="margin-bottom: ${gap}px;" data-section="${sectionId}">`;
        row.forEach((img, imgIndex) => {
            html += `<div class="gallery-image-wrapper" style="margin-right: ${imgIndex < row.length - 1 ? gap : 0}px; cursor: pointer;" data-index="${img.index}">
                <img src="${img.src}" alt="${img.alt}" style="width: ${img.width}px; height: ${img.height}px; object-fit: cover; display: block;">
                <div class="gallery-image-overlay">
                    <div class="gallery-image-description">${img.description || img.alt}</div>
                </div>
            </div>`;
        });
        html += '</div>';
    });

    html += '</div>';

    // Add "See more" button if there are more than 3 rows
    if (rows.length > visibleRows) {
        html += `<div class="see-more-container"><button class="see-more-btn" data-section="${sectionId}">See more</button></div>`;
    }

    return html;
}

function renderGallerySection(title, description, images, containerWidth, sectionId, minImagesPerRow = 3) {
    const rows = createBinPackedLayout(images, containerWidth, 300, 10, minImagesPerRow);
    let html = `<div class="gallery-section">`;
    if (title) {
        html += `<h2 class="project-title">${title}</h2>`;
    }
    if (description) {
        html += `<p class="project-description">${description}</p>`;
    }
    html += renderBinPackedLayout(rows, 10, sectionId);
    html += `</div>`;
    return html;
}

// Lightbox functionality
let lightboxImages = [];
let currentLightboxIndex = 0;

function initLightbox(images) {
    lightboxImages = images;

    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    // Add click handlers to all image wrappers
    document.querySelectorAll('.gallery-image-wrapper').forEach(wrapper => {
        wrapper.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            openLightbox(index);
        });
    });

    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });

    // "See more" button functionality for all sections
    document.querySelectorAll('.see-more-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            // Show all hidden rows in this section
            document.querySelectorAll(`.hidden-row[data-section="${sectionId}"]`).forEach(row => {
                row.classList.remove('hidden-row');
            });
            // Hide the button
            this.parentElement.style.display = 'none';
        });
    });
}

function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxDescription = document.getElementById('lightboxDescription');

    lightbox.classList.add('active');
    lightboxImage.src = lightboxImages[index].src;
    lightboxImage.alt = lightboxImages[index].alt;
    lightboxDescription.textContent = lightboxImages[index].description || lightboxImages[index].alt;

    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showPrevImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    openLightbox(currentLightboxIndex);
}

function showNextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
    openLightbox(currentLightboxIndex);
}

// Load project content
function loadProject() {
    const projectId = getProjectId();
    const project = projects[projectId];

    if (project) {
        document.getElementById('categoryTitle').textContent = project.category;
        document.getElementById('projectTitle').textContent = project.title;
        document.getElementById('projectDescription').textContent = project.description;

        // Custom content for magazines project - using dynamic loading
        if (projectId === 'magazines') {
            renderDynamicGallery('2-magazines', {
                '1-elle': 'Elle',
                '2-ellegirl': 'Elle Girl',
                '3-cosmo': 'Cosmopolitan'
            });
        }

        // Custom content for illustration project - using dynamic loading
        if (projectId === 'illustration') {
            renderDynamicGallery('6-illustrations', {
                'comic_zina-lyucia': 'Zina & Lyucia Comic',
                'comic-general': 'General Comics'
            });
        }
    }
}

// Helper function to load project from gallery-data.json
async function loadDynamicProject(projectId, sectionTitles) {
    if (!window.loadProjectGallery) {
        console.error('Gallery loader not available');
        return null;
    }

    const sections = await window.loadProjectGallery(projectId, sectionTitles);

    if (!sections || sections.length === 0) {
        console.warn(`No sections found for project: ${projectId}`);
        return null;
    }

    return sections;
}

// Helper to render dynamic gallery sections
async function renderDynamicGallery(projectId, sectionTitles = {}) {
    const projectImagesDiv = document.querySelector('.project-images');
    const sections = await loadDynamicProject(projectId, sectionTitles);

    if (!sections) {
        projectImagesDiv.innerHTML = '<p style="color: #888;">No images found. Run generate-gallery.sh to scan your gallery folder.</p>';
        return;
    }

    const containerWidth = Math.min(1000, projectImagesDiv.offsetWidth || 1000);
    let html = '';
    let allImages = [];

    // Load actual image dimensions
    const loadImageDimensions = (imageObj) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                imageObj.width = img.naturalWidth;
                imageObj.height = img.naturalHeight;
                resolve(imageObj);
            };
            img.onerror = () => resolve(imageObj); // Keep placeholder dimensions
            img.src = imageObj.src;
        });
    };

    // Load all images with dimensions
    for (const section of sections) {
        const loadedImages = await Promise.all(
            section.images.map(img => loadImageDimensions(img))
        );
        section.images = loadedImages;
        allImages = allImages.concat(loadedImages);
    }

    // Render sections
    sections.forEach(section => {
        const description = section.description || `Collection of ${section.title.toLowerCase()} designs and layouts showcasing creative work.`;
        const minImagesPerRow = section.title === 'Elle' ? 2 : 3;
        html += renderGallerySection(section.title, description, section.images, containerWidth, section.sectionId, minImagesPerRow);
    });

    projectImagesDiv.innerHTML = html;
    initLightbox(allImages);
}

// Load project when page loads
window.addEventListener('DOMContentLoaded', loadProject);
