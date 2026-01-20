// Project data - you can customize this with your actual project information
const projects = {
    brands: {
        category: 'BRANDS',
        title: 'Brand Design',
        description: 'Brand identity and design work featuring Testarossa Winery and Passion Embrace collections.'
    },
    magazines: {
        category: 'MAGAZINES',
        title: 'Magazine Design',
        description: 'Editorial design work featuring magazine layouts, cover designs, and fashion photography for Elle, Elle Girl, and Cosmopolitan publications.'
    },
    prints: {
        category: 'PRINTS',
        title: 'Print Design',
        description: 'Print design projects including greeting cards, editorial layouts, and publication designs.'
    },
    digital: {
        category: 'DIGITAL',
        title: 'Digital Design',
        description: 'Digital design work including email campaigns, web graphics, and digital marketing materials.'
    },
    logos: {
        category: 'LOGOS',
        title: 'Logo Design',
        description: 'Logo design and brand identity work for various clients including Linguamill and OST.'
    },
    illustration: {
        category: 'ILLUSTRATION',
        title: 'Comic Illustration',
        description: 'Original comic and illustration work featuring character designs, sequential storytelling, and narrative art exploring themes of friendship and adventure.'
    },
    animation: {
        category: 'ANIMATION',
        title: 'Animation & Motion Graphics',
        description: 'Collection of animated works including character animation, motion graphics, and experimental video projects exploring movement and storytelling.'
    },
    unsorted: {
        category: 'DISPLAY',
        title: 'Mixed Work',
        description: 'Collection of various studies and experimental work including hand poses and character development.'
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

function renderBinPackedLayout(rows, gap = 10, sectionId = '', isAnimationProject = false, sectionOptions = {}) {
    const visibleRows = 3;
    let html = '<div class="bin-packed-layout">';

    rows.forEach((row, rowIndex) => {
        const isHidden = rowIndex >= visibleRows && rows.length > visibleRows;
        const hiddenClass = isHidden ? ' hidden-row' : '';
        html += `<div class="bin-packed-row${hiddenClass}" style="margin-bottom: ${gap}px;" data-section="${sectionId}">`;
        row.forEach((img, imgIndex) => {
            let mediaElement;

            // Check if this is a Pivot Point video (blue or pink) or OST video or Monster Bow videos
            const isPivotPointVideo = img.src.includes('3-pivotpoint') &&
                                     (img.src.includes('5-PP-sm_blue.mp4') ||
                                      img.src.includes('8a-PP-sm_pink2.mp4'));
            const isOSTVideo = img.src.includes('1-OST') && img.src.includes('1c-Untitled_Artwork 2.mp4');
            const isMonsterBowVideo = img.src.includes('3-monster-bow') && img.isVideo;

            const animationClass = isAnimationProject || isPivotPointVideo || isOSTVideo || isMonsterBowVideo ? ' animation-video' : '';
            const autoplayAttr = isPivotPointVideo || isOSTVideo || isMonsterBowVideo ? ' autoplay' : '';

            if (img.isVideo) {
                // Generate thumbnail path (video_name_thumb.jpg)
                const videoPath = img.src.substring(0, img.src.lastIndexOf('.'));
                const posterPath = `${videoPath}_thumb.jpg`;
                mediaElement = `<video src="${img.src}" poster="${posterPath}" style="width: ${img.width}px; height: ${img.height}px; object-fit: cover; display: block;" muted loop playsinline${autoplayAttr} data-has-audio="false"></video>`;
            } else {
                mediaElement = `<img src="${img.src}" alt="${img.alt}" style="width: ${img.width}px; height: ${img.height}px; object-fit: cover; display: block;">`;
            }

            const overlayHtml = (isAnimationProject || isPivotPointVideo || isOSTVideo || isMonsterBowVideo) && img.isVideo
                ? '' // No overlay for animation-style videos
                : `<div class="gallery-image-overlay">
                    <div class="gallery-image-description">${img.description || img.alt}</div>
                </div>`;

            // Check if this video needs inverted button colors (for dark videos)
            const needsInvertedButton = img.src.includes('0-effect_match_olenakovtash') ||
                                       img.src.includes('3-neveralone_nocopyright') ||
                                       img.src.includes('LeakyPeople_final_low');
            const invertedClass = needsInvertedButton ? ' inverted' : '';

            // Exclude Testarossa section from sound buttons
            const isTestarossaVideo = img.src.includes('testarossa-winery');

            const soundButtonHtml = (isAnimationProject || isPivotPointVideo || isOSTVideo || isMonsterBowVideo) && img.isVideo && !isTestarossaVideo
                ? `<button class="sound-toggle-btn${invertedClass}" data-muted="true" style="display: none;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                        <path class="sound-on-indicator" d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke-width="2"/>
                        <path class="sound-on-indicator" d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke-width="2"/>
                        <line class="sound-off-indicator" x1="23" y1="9" x2="17" y2="15" stroke-width="2"/>
                        <line class="sound-off-indicator" x1="17" y1="9" x2="23" y2="15" stroke-width="2"/>
                    </svg>
                </button>`
                : '';

            html += `<div class="gallery-image-wrapper${animationClass}" style="margin-right: ${imgIndex < row.length - 1 ? gap : 0}px; cursor: pointer;" data-index="${img.index}">
                ${mediaElement}
                ${overlayHtml}
                ${soundButtonHtml}
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

function renderGallerySection(title, description, images, containerWidth, sectionId, minImagesPerRow = 3, isAnimationProject = false, sectionOptions = {}) {
    // Use custom row height for specific sections
    const targetRowHeight = sectionOptions.targetRowHeight || 300;
    const rows = createBinPackedLayout(images, containerWidth, targetRowHeight, 10, minImagesPerRow);
    let html = `<div class="gallery-section">`;
    if (title) {
        html += `<h2 class="project-title">${title}</h2>`;
    }
    if (description) {
        html += `<p class="project-description">${description}</p>`;
    }
    html += renderBinPackedLayout(rows, 10, sectionId, isAnimationProject, sectionOptions);
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
        const isAnimationVideo = wrapper.classList.contains('animation-video');
        const video = wrapper.querySelector('video');
        const soundBtn = wrapper.querySelector('.sound-toggle-btn');

        // Click to open lightbox
        wrapper.addEventListener('click', function(e) {
            // Don't open lightbox if clicking the sound button
            if (e.target.closest('.sound-toggle-btn')) {
                return;
            }
            const index = parseInt(this.getAttribute('data-index'));
            openLightbox(index);
        });

        // Add hover play/pause for videos
        if (video) {
            let audioCheckDone = false;

            // Quick initial check on metadata
            video.addEventListener('loadedmetadata', function() {
                checkVideoAudio();
            });

            // Check for audio tracks
            const checkVideoAudio = () => {
                let hasAudio = false;

                // Method 1: Check audioTracks API
                if (video.audioTracks && video.audioTracks.length > 0) {
                    hasAudio = true;
                }
                // Method 2: Mozilla-specific property
                else if (typeof video.mozHasAudio !== 'undefined') {
                    hasAudio = video.mozHasAudio;
                }
                // Method 3: Webkit - assume has audio and verify during playback
                else if (typeof video.webkitAudioDecodedByteCount !== 'undefined') {
                    hasAudio = true; // Optimistic for webkit, will verify on play
                }

                video.setAttribute('data-has-audio', hasAudio ? 'true' : 'false');
                audioCheckDone = true;
            };

            // Double-check for webkit browsers after brief playback
            video.addEventListener('playing', function checkWebkitAudio() {
                setTimeout(() => {
                    if (typeof video.webkitAudioDecodedByteCount !== 'undefined') {
                        const hasAudio = video.webkitAudioDecodedByteCount > 0;
                        video.setAttribute('data-has-audio', hasAudio ? 'true' : 'false');

                        // Update button visibility if it's currently shown
                        if (soundBtn && soundBtn.style.display === 'flex' && !hasAudio) {
                            soundBtn.style.display = 'none';
                        }
                    }
                }, 100);
                video.removeEventListener('playing', checkWebkitAudio);
            });

            // Hover behavior for animation videos
            if (isAnimationVideo) {
                const hasAutoplay = video.hasAttribute('autoplay');

                wrapper.addEventListener('mouseenter', () => {
                    // Only start playing if not autoplay (autoplay videos are already playing)
                    if (!hasAutoplay) {
                        video.play();
                    }

                    // If audio check not done yet, do it now
                    if (!audioCheckDone) {
                        checkVideoAudio();
                    }

                    // Show sound button if video has audio
                    if (soundBtn && video.getAttribute('data-has-audio') === 'true') {
                        soundBtn.style.display = 'flex';
                    }
                });
                wrapper.addEventListener('mouseleave', () => {
                    // Only pause if not autoplay (autoplay videos should keep playing)
                    if (!hasAutoplay) {
                        video.pause();
                    }
                    if (soundBtn) {
                        soundBtn.style.display = 'none';
                    }
                });

                // Sound toggle button handler
                if (soundBtn) {
                    soundBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const isMuted = video.muted;
                        video.muted = !isMuted;
                        this.setAttribute('data-muted', !isMuted);
                    });
                }

                // For autoplay videos, check audio immediately and show button if has audio
                if (hasAutoplay) {
                    video.addEventListener('loadedmetadata', function checkAutoplayAudio() {
                        checkVideoAudio();
                        if (video.getAttribute('data-has-audio') === 'true' && soundBtn) {
                            soundBtn.style.display = 'flex';
                        }
                    }, { once: true });
                }
            } else {
                // Regular hover play/pause for non-animation videos
                wrapper.addEventListener('mouseenter', () => video.play());
                wrapper.addEventListener('mouseleave', () => video.pause());
            }
        }
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

    // Start all autoplay videos immediately when they're ready
    // Use setTimeout to ensure DOM is fully rendered
    setTimeout(() => {
        document.querySelectorAll('video[autoplay]').forEach(video => {
            // Ensure video is muted for autoplay to work
            video.muted = true;

            // Force load the video
            video.load();

            // Function to attempt playback
            const attemptPlay = () => {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('Video playing:', video.src);
                    }).catch(error => {
                        console.log('Autoplay prevented for:', video.src, error);
                        // Retry after a short delay
                        setTimeout(attemptPlay, 100);
                    });
                }
            };

            // Try to play immediately if already loaded
            if (video.readyState >= 2) { // HAVE_CURRENT_DATA or greater
                attemptPlay();
            } else {
                // Wait for video to be ready, then play
                video.addEventListener('loadeddata', attemptPlay, { once: true });
            }
        });
    }, 100);
}

function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImageWrapper = document.querySelector('.lightbox-image-wrapper');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const currentMedia = lightboxImages[index];

    // Check if this is an animation project video (7-animation in the path)
    const isAnimationVideo = currentMedia.src.includes('7-animation') && currentMedia.isVideo;

    lightbox.classList.add('active');

    // Clear previous content and stop any playing video
    const existingMedia = lightboxImageWrapper.querySelector('img, video');
    if (existingMedia) {
        // If it's a video, stop it before removing
        if (existingMedia.tagName === 'VIDEO') {
            existingMedia.pause();
            existingMedia.currentTime = 0;
        }
        existingMedia.remove();
    }

    if (currentMedia.isVideo) {
        const video = document.createElement('video');
        video.src = currentMedia.src;

        // Add poster thumbnail
        const videoPath = currentMedia.src.substring(0, currentMedia.src.lastIndexOf('.'));
        video.poster = `${videoPath}_thumb.jpg`;

        video.id = 'lightboxImage';
        video.controls = true;
        video.autoplay = true;
        video.loop = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '90vh';
        video.style.objectFit = 'contain';
        video.style.display = 'block';
        lightboxImageWrapper.insertBefore(video, lightboxDescription);
    } else {
        const img = document.createElement('img');
        img.src = currentMedia.src;
        img.alt = currentMedia.alt;
        img.id = 'lightboxImage';

        // Check if this is from the prints gallery (3-print in the path)
        const isPrintsGallery = currentMedia.src.includes('3-print');

        if (isPrintsGallery) {
            // For prints gallery, don't upscale - show at original size or smaller
            img.style.maxWidth = '100%';
            img.style.maxHeight = '90vh';
            img.style.width = 'auto';
            img.style.height = 'auto';
            img.style.objectFit = 'contain';
        }

        lightboxImageWrapper.insertBefore(img, lightboxDescription);
    }

    // Hide description for animation videos, show for others
    if (isAnimationVideo) {
        lightboxDescription.style.display = 'none';
    } else {
        lightboxDescription.style.display = 'block';
        lightboxDescription.textContent = currentMedia.description || currentMedia.alt;
    }

    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');

    // Stop any playing video
    const video = lightbox.querySelector('video');
    if (video) {
        video.pause();
        video.currentTime = 0;
    }

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

        // Custom content for brands project - using dynamic loading
        if (projectId === 'brands') {
            renderDynamicGallery('1-brands', {
                '1-testarossa': 'Testarossa Winery',
                '2-passion-embrace': 'Passion Embrace',
                '3-pivotpoint': 'Pivot Point'
            });
        }

        // Custom content for magazines project - using dynamic loading
        if (projectId === 'magazines') {
            renderDynamicGallery('2-magazines', {
                '1-elle': 'Elle',
                '2-ellegirl': 'Elle Girl',
                '3-cosmo': 'Cosmopolitan',
                '4-tech': 'Tech Magazine'
            });
        }

        // Custom content for prints project - using dynamic loading
        if (projectId === 'prints') {
            renderDynamicGallery('3-print', {
                '1-cards_cali': 'California Cards',
                '4-zoomer': 'Zoomer Magazine'
            });
        }

        // Custom content for digital project - using dynamic loading
        if (projectId === 'digital') {
            renderDynamicGallery('4-digital', {
                '1-elle-icon': 'Elle Icon',
                '2-email': 'Email Campaign',
                '3-monster-bow': 'Monster Bow'
            });
        }

        // Custom content for logos project - using dynamic loading
        if (projectId === 'logos') {
            renderDynamicGallery('5-logos', {
                '1-OST': 'OST',
                '2-L': 'Linguamill',
                '3-Zoloti-maky': 'Zoloti Maky',
                '4-NEN': 'NEN',
                '5-Miele': 'Miele'
            });
        }

        // Custom content for illustration project - using dynamic loading
        if (projectId === 'illustration') {
            renderDynamicGallery('6-illustrations', {
                '1-kids-books': 'Kids Books',
                '2-character-design': 'Character Design',
                '3-tryzub': 'Tryzub',
                '4-human': 'Human',
                '5-food': 'Food',
                '6-comic-general': 'General Comics',
                '7a-comic_zina-lyucia': 'Zina & Lyucia Comic',
                '8-sketchbook': 'Sketchbook'
            });
        }

        // Custom content for animation project - using dynamic loading
        if (projectId === 'animation') {
            renderDynamicGallery('7-animation', {
                '1-three stories': 'Three Stories',
                '2-dances': 'Character Animation',
                '3-testarossa-winery': 'Testarossa Winery',
                '4-leaky people': 'Leaky People',
                '5-work-in-progress': 'Work in Progress'
            });
        }

        // Custom content for unsorted project - using dynamic loading
        if (projectId === 'unsorted') {
            renderDynamicGallery('8-unsorted', {
                '1-hands': 'Hand Studies',
                '2-comparsita': 'Comparsita'
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
async function renderDynamicGallery(projectId, sectionTitles = {}, sectionOptionsMap = {}) {
    const projectImagesDiv = document.querySelector('.project-images');
    const sections = await loadDynamicProject(projectId, sectionTitles);

    if (!sections) {
        projectImagesDiv.innerHTML = '<p style="color: #888;">No images found. Run generate-gallery.sh to scan your gallery folder.</p>';
        return;
    }

    const containerWidth = Math.min(1000, projectImagesDiv.offsetWidth || 1000);
    let html = '';
    let allImages = [];

    // Load actual image/video dimensions
    const loadImageDimensions = (imageObj) => {
        return new Promise((resolve) => {
            if (imageObj.isVideo) {
                const video = document.createElement('video');
                video.onloadedmetadata = () => {
                    imageObj.width = video.videoWidth;
                    imageObj.height = video.videoHeight;
                    resolve(imageObj);
                };
                video.onerror = () => resolve(imageObj); // Keep placeholder dimensions
                video.src = imageObj.src;
            } else {
                const img = new Image();
                img.onload = () => {
                    imageObj.width = img.naturalWidth;
                    imageObj.height = img.naturalHeight;
                    resolve(imageObj);
                };
                img.onerror = () => resolve(imageObj); // Keep placeholder dimensions
                img.src = imageObj.src;
            }
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

    // Check if this is the animation project
    const isAnimationProject = projectId === '7-animation';

    // Render sections
    sections.forEach(section => {
        const description = section.description || `Collection of ${section.title.toLowerCase()} designs and layouts showcasing creative work.`;
        let minImagesPerRow = 3; // Default
        if (section.title === 'Elle' || section.title === 'Three Stories') {
            minImagesPerRow = 2;
        } else if (section.title === 'Work in Progress') {
            minImagesPerRow = 3;
        } else if (section.title === 'Food') {
            minImagesPerRow = 8;
        }

        // Get section-specific options from the map (keyed by section key like '3-pivotpoint')
        const sectionKey = Object.keys(sectionTitles).find(key => sectionTitles[key] === section.title) || '';
        let sectionOptions = sectionOptionsMap[sectionKey] || {};

        // Set smaller row height for food section to fit 7-8 images per row
        if (section.title === 'Food') {
            sectionOptions = { ...sectionOptions, targetRowHeight: 120 };
        }

        html += renderGallerySection(section.title, description, section.images, containerWidth, section.sectionId, minImagesPerRow, isAnimationProject, sectionOptions);
    });

    projectImagesDiv.innerHTML = html;
    initLightbox(allImages);
}

// Load project when page loads
window.addEventListener('DOMContentLoaded', loadProject);
