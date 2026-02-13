/**
 * Mobile Video Play - Add play buttons to all videos on mobile
 * Runs on all project pages on mobile devices
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile
    if (window.innerWidth > 768) return;

    // Only run on project pages
    if (!window.location.pathname.includes('project-')) return;

    // Function to add play button to a video
    function addPlayButton(video) {
        const wrapper = video.closest('.gallery-image-wrapper');

        // Skip if already has a play button
        if (wrapper.querySelector('.mobile-play-btn')) {
            return;
        }

        // Prepare video for iOS playback and disable autoplay on mobile
        video.removeAttribute('muted');
        video.removeAttribute('autoplay'); // Disable autoplay on mobile for user control
        video.muted = false;
        video.defaultMuted = false;
        video.pause(); // Ensure video is paused initially
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

        // Flag to prevent double-firing on mobile (touchend + click)
        var touchHandled = false;

        // Handle play button clicks (both touch and click)
        playBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            touchHandled = true;
            setTimeout(function() { touchHandled = false; }, 500);

            console.log('Play button touched for video:', video.src);

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

        // Handle play/pause
        playBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // Ignore click if touch was just handled
            if (touchHandled) {
                console.log('Play button click ignored - touch was just handled');
                return false;
            }

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

        // Also handle touch events for better mobile support (shares touchHandled flag with button)
        video.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            touchHandled = true;
            setTimeout(function() { touchHandled = false; }, 500);

            console.log('Video touched, paused:', video.paused);

            if (!video.paused) {
                video.pause();
                playBtn.style.display = 'flex';
                console.log('Video paused via touch, showing play button');
            } else {
                // Video is paused, resume playback
                video.muted = false;
                video.volume = 1.0;
                var playPromise = video.play();

                if (playPromise !== undefined) {
                    playPromise.then(function() {
                        console.log('Video resumed via touch with audio');
                        playBtn.style.display = 'none';
                    }).catch(function(error) {
                        console.log('Resume via touch with audio failed:', error);
                        playBtn.style.display = 'none';
                    });
                } else {
                    playBtn.style.display = 'none';
                }
            }
            return false;
        }, true);

        // Allow clicking video to toggle play/pause, prevent lightbox
        video.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // Ignore click if touch was just handled
            if (touchHandled) {
                console.log('Click ignored - touch was just handled');
                return false;
            }

            console.log('Video clicked, paused:', video.paused);

            if (!video.paused) {
                video.pause();
                playBtn.style.display = 'flex';
                console.log('Video paused, showing play button');
            } else {
                // Video is paused, resume playback
                video.muted = false;
                video.volume = 1.0;
                var playPromise = video.play();

                if (playPromise !== undefined) {
                    playPromise.then(function() {
                        console.log('Video resumed with audio');
                        playBtn.style.display = 'none';
                    }).catch(function(error) {
                        console.log('Resume with audio failed:', error);
                        playBtn.style.display = 'none';
                    });
                } else {
                    playBtn.style.display = 'none';
                }
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

    // Process all videos initially
    const allVideos = document.querySelectorAll('.gallery-image-wrapper video');
    allVideos.forEach(function(video) {
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
                    const videos = node.querySelectorAll && node.querySelectorAll('.gallery-image-wrapper video');
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
