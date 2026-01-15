/**
 * Gallery Loader
 * Dynamically loads gallery images from gallery-data.json
 */

async function loadGalleryData() {
    try {
        const response = await fetch('gallery-data.json');
        if (!response.ok) {
            throw new Error('Gallery data not found');
        }
        return await response.json();
    } catch (error) {
        console.warn('Could not load gallery-data.json:', error.message);
        console.log('Using fallback empty gallery structure');
        return { projects: {} };
    }
}

function isVideoFile(src) {
    const ext = src.split('.').pop().toLowerCase();
    return ['mp4', 'mov', 'webm', 'ogg'].includes(ext);
}

function createImageObject(src, index, description) {
    return {
        src: src,
        alt: src.split('/').pop(),
        description: description || src.split('/').pop(),
        index: index,
        isVideo: isVideoFile(src),
        // Placeholder dimensions - will be replaced when image/video loads
        width: 800,
        height: 600
    };
}

function generateSectionTitle(sectionKey) {
    // Remove number prefix (e.g., "1-", "2-")
    let title = sectionKey.replace(/^\d+-/, '');

    // Replace dashes and underscores with spaces
    title = title.replace(/[-_]/g, ' ');

    // Capitalize each word
    title = title.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    return title;
}

async function loadProjectGallery(projectId, sectionTitles = {}) {
    const galleryData = await loadGalleryData();

    if (!galleryData.projects || !galleryData.projects[projectId]) {
        console.warn(`No gallery data found for project: ${projectId}`);
        return [];
    }

    const projectData = galleryData.projects[projectId];
    const sections = [];
    let globalIndex = 0;

    // Get section entries and sort by key name (respects number prefixes like "1-", "2-")
    const sortedSectionEntries = Object.entries(projectData.sections).sort((a, b) => {
        return a[0].localeCompare(b[0], undefined, { numeric: true, sensitivity: 'base' });
    });

    // Process each section in sorted order
    sortedSectionEntries.forEach(([sectionKey, sectionData]) => {
        const sectionTitle = sectionTitles[sectionKey] || generateSectionTitle(sectionKey);
        const images = sectionData.images || [];

        const sectionImages = images.map((imagePath, localIndex) => {
            const img = createImageObject(
                imagePath,
                globalIndex++,
                `${sectionTitle} ${localIndex + 1}`
            );
            return img;
        });

        sections.push({
            title: sectionTitle,
            images: sectionImages,
            sectionId: `section-${sections.length}`
        });
    });

    return sections;
}

// Export for use in project.js
window.loadGalleryData = loadGalleryData;
window.loadProjectGallery = loadProjectGallery;
