// Project data - you can customize this with your actual project information
const projects = {
    brands: {
        category: 'BRANDS',
        title: 'Testarossa Winery',
        description: 'Highlighted text groovinghighlighted groovinghighlighted groovinghighlighted groovinghighlighted groovinghighlighted groovinghighlighted groovinghighlighted groovinghighlighted groovinghighlighted grooving highlighted groovinghighlighted grooving highlighted grooving highlighted grooving'
    },
    magazines: {
        category: 'MAGAZINES',
        title: 'Project Name',
        description: 'Add your project description here. Describe what the project is about, your role, and any interesting details about the work you did.'
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
        description: 'Add your project description here. Describe what the project is about, your role, and any interesting details about the work you did.'
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
function createBinPackedLayout(images, containerWidth, targetRowHeight = 300, gap = 10) {
    const rows = [];
    let currentRow = [];
    let currentRowWidth = 0;

    images.forEach((img, index) => {
        const aspectRatio = img.width / img.height;
        const scaledWidth = targetRowHeight * aspectRatio;

        if (currentRowWidth + scaledWidth + (currentRow.length * gap) <= containerWidth) {
            currentRow.push({ ...img, index, scaledWidth });
            currentRowWidth += scaledWidth;
        } else {
            if (currentRow.length > 0) {
                rows.push(normalizeRow(currentRow, containerWidth, targetRowHeight, gap));
            }
            currentRow = [{ ...img, index, scaledWidth }];
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

function renderBinPackedLayout(rows, gap = 10) {
    let html = '<div class="bin-packed-layout">';

    rows.forEach(row => {
        html += '<div class="bin-packed-row" style="margin-bottom: ' + gap + 'px;">';
        row.forEach(img => {
            html += `<img src="${img.src}" alt="${img.alt}" style="width: ${img.width}px; height: ${img.height}px; margin-right: ${gap}px; object-fit: cover;">`;
        });
        html += '</div>';
    });

    html += '</div>';
    return html;
}

// Load project content
function loadProject() {
    const projectId = getProjectId();
    const project = projects[projectId];

    if (project) {
        document.getElementById('categoryTitle').textContent = project.category;
        document.getElementById('projectTitle').textContent = project.title;
        document.getElementById('projectDescription').textContent = project.description;

        // Custom content for illustration project with bin packing
        if (projectId === 'illustration') {
            const projectImagesDiv = document.querySelector('.project-images');

            // Define images with their paths
            const imagePaths = [
                'images/comic/comic-general/comic1.jpg',
                'images/comic/comic-general/comic2.jpg',
                'images/comic/comic-general/comic3.jpg',
                'images/comic/comic-general/comic4.jpg',
                'images/comic/comic-general/comic5.jpg'
            ];

            // Load images and get their dimensions
            Promise.all(imagePaths.map(src => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        resolve({
                            src: src,
                            alt: src.split('/').pop(),
                            width: img.naturalWidth,
                            height: img.naturalHeight
                        });
                    };
                    img.onerror = () => {
                        // If image doesn't exist, use placeholder dimensions
                        resolve({
                            src: src,
                            alt: src.split('/').pop(),
                            width: 800,
                            height: 600
                        });
                    };
                    img.src = src;
                });
            })).then(images => {
                const containerWidth = Math.min(1000, projectImagesDiv.offsetWidth || 1000);
                const rows = createBinPackedLayout(images, containerWidth, 300, 10);
                projectImagesDiv.innerHTML = renderBinPackedLayout(rows, 10);
            });
        }
    }
}

// Load project when page loads
window.addEventListener('DOMContentLoaded', loadProject);
