// Lightbox functionality for static portfolio site
// lightboxImages is defined by the HTML page before this script loads
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
        video.setAttribute('preload', 'metadata');

        // Create source element with explicit type
        const source = document.createElement('source');
        source.src = currentMedia.src;
        source.type = 'video/mp4';
        video.appendChild(source);

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
