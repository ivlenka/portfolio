/**
 * Mobile Animation Play - Add play buttons to animation videos on mobile
 * Only runs on animation project page on mobile devices
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile
    if (window.innerWidth > 768) return;

    // Only run on animation project page
    if (!window.location.pathname.includes('project-animation')) return;

    // Function to add play button to a video
    function addPlayButton(video) {
        const wrapper = video.closest('.gallery-image-wrapper');

        // Skip if already has a play button
        if (wrapper.querySelector('.mobile-play-btn')) {
            return;
        }

        // Prepare video for iOS playback
        video.removeAttribute('muted');
        video.muted = false;
        video.defaultMuted = false;
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');

        // Ensure video source is loaded
        if (video.readyState < 3) { // Not HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
            video.load();
        }

        // Check if video is inverted (dark background)
        const isInverted = wrapper.classList.contains('inverted') ||
                          wrapper.querySelector('.sound-toggle-btn.inverted');

        // Create play button
        const playBtn = document.createElement('button');
        playBtn.className = 'mobile-play-btn' + (isInverted ? ' inverted' : '');

        // Play icon SVG
        const playIcon = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>
        `;

        // Pause icon SVG
        const pauseIcon = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
            </svg>
        `;

        playBtn.innerHTML = playIcon;
        wrapper.appendChild(playBtn);

        // Disable lightbox on this wrapper
        wrapper.removeAttribute('data-index');
        wrapper.style.cursor = 'default';

        // Handle play/pause
        playBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            console.log('Play button clicked for video:', video.src);

            if (video.paused) {
                // iOS-friendly playback - don't call load(), just play directly
                video.muted = false;
                video.volume = 1.0;

                // Try to play with audio first
                var playPromise = video.play();

                if (playPromise !== undefined) {
                    playPromise.then(function() {
                        console.log('Video playing with audio');
                        playBtn.style.display = 'none';
                    }).catch(function(error) {
                        console.log('Play with audio failed:', error);

                        // iOS fallback: If audio play fails, try muted playback
                        video.muted = true;
                        var mutedPlayPromise = video.play();

                        if (mutedPlayPromise !== undefined) {
                            mutedPlayPromise.then(function() {
                                console.log('Video playing muted (iOS fallback)');
                                playBtn.style.display = 'none';

                                // Try to unmute after playing starts
                                setTimeout(function() {
                                    video.muted = false;
                                    console.log('Attempted to unmute after playback started');
                                }, 100);
                            }).catch(function(mutedError) {
                                console.log('Even muted play failed:', mutedError);
                                playBtn.style.display = 'none';
                            });
                        } else {
                            playBtn.style.display = 'none';
                        }
                    });
                } else {
                    playBtn.style.display = 'none';
                }
            } else {
                video.pause();
                playBtn.style.display = 'flex';
            }

            return false;
        }, true);

        // Show button when video is paused
        video.addEventListener('pause', function() {
            playBtn.style.display = 'flex';
        });

        // Show button when video is playing (in case we want to pause)
        video.addEventListener('play', function() {
            playBtn.style.display = 'none';
        });

        // Show button when video ends
        video.addEventListener('ended', function() {
            playBtn.style.display = 'flex';
        });

        // Allow clicking video to pause, prevent lightbox
        video.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (!video.paused) {
                video.pause();
            }
            return false;
        }, true);

        // Prevent lightbox from opening when clicking on video wrapper
        wrapper.addEventListener('click', function(e) {
            if (e.target === video || e.target === playBtn || e.target.closest('.mobile-play-btn')) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            }
        }, true);
    }

    // Process all animation videos initially
    const animationVideos = document.querySelectorAll('.gallery-image-wrapper.animation-video video');
    animationVideos.forEach(function(video) {
        addPlayButton(video);
    });

    // Observer to add play buttons when new videos become visible (after "See more" clicked)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    // Check if the node itself is a video wrapper
                    if (node.classList && node.classList.contains('gallery-image-wrapper')) {
                        const video = node.querySelector('video');
                        if (video) {
                            addPlayButton(video);
                        }
                    }
                    // Also check children
                    const videos = node.querySelectorAll && node.querySelectorAll('.gallery-image-wrapper.animation-video video');
                    if (videos) {
                        videos.forEach(function(video) {
                            addPlayButton(video);
                        });
                    }
                }
            });

            // Also check for style changes (display: none -> display: block)
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const target = mutation.target;
                if (target.classList && target.classList.contains('gallery-image-wrapper')) {
                    const video = target.querySelector('video');
                    if (video && target.style.display !== 'none') {
                        addPlayButton(video);
                    }
                }
            }
        });
    });

    // Start observing the document for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
});
