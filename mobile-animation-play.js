/**
 * Mobile Video Play - Add play buttons to all videos on mobile
 * Runs on all project pages on mobile devices
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile
    if (window.innerWidth > 768) return;

    // Only run on project pages
    if (!window.location.pathname.includes('project-')) return;

    // Function to add sound toggle button for autoplay videos
    function addSoundToggleButton(video, wrapper) {
        // Check if video is inverted (dark background)
        const isInverted = wrapper.classList.contains('inverted') ||
                          wrapper.querySelector('.sound-toggle-btn.inverted');

        // Create sound toggle button
        const soundBtn = document.createElement('button');
        soundBtn.className = 'mobile-sound-btn' + (isInverted ? ' inverted' : '');

        // Muted icon (speaker with X)
        const mutedIcon = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
        `;

        // Unmuted icon (speaker with sound waves)
        const unmutedIcon = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
        `;

        // Start with muted icon (video starts muted)
        soundBtn.innerHTML = mutedIcon;
        wrapper.appendChild(soundBtn);

        // Flag to prevent double-firing
        var touchHandled = false;

        // Handle touch events
        soundBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            touchHandled = true;
            setTimeout(function() { touchHandled = false; }, 500);

            toggleSound();
            return false;
        }, true);

        // Handle click events
        soundBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (touchHandled) {
                return false;
            }

            toggleSound();
            return false;
        }, true);

        function toggleSound() {
            if (video.muted) {
                video.muted = false;
                video.volume = 1.0;
                soundBtn.innerHTML = unmutedIcon;
                console.log('Video unmuted');
            } else {
                video.muted = true;
                soundBtn.innerHTML = mutedIcon;
                console.log('Video muted');
            }
        }
    }

    // Function to add play button or sound toggle to a video
    function addPlayButton(video) {
        const wrapper = video.closest('.gallery-image-wrapper');

        // Skip if already has a play button or sound toggle
        if (wrapper.querySelector('.mobile-play-btn') || wrapper.querySelector('.mobile-sound-btn')) {
            return;
        }

        // Check video source to determine section
        const videoSrc = video.querySelector('source')?.src || video.src || '';
        const isPivotPoint = videoSrc.includes('pivotpoint');
        const isMonsterBow = videoSrc.includes('monster-bow');
        const isAutoplayVideo = isPivotPoint || isMonsterBow;

        if (isAutoplayVideo) {
            // For Pivot Point and Monster Bow: Keep autoplay, disable lightbox
            video.setAttribute('playsinline', 'true');
            video.setAttribute('webkit-playsinline', 'true');

            // Disable lightbox on this wrapper
            wrapper.removeAttribute('data-index');
            wrapper.style.cursor = 'default';

            // Prevent lightbox from opening when clicking on video wrapper
            wrapper.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            }, true);

            // Add sound toggle button for Pivot Point videos only
            if (isPivotPoint) {
                addSoundToggleButton(video, wrapper);
            }

            return; // Don't add play button
        }

        // For other videos: add play/pause toggle button
        // Prepare video for iOS playback and disable autoplay on mobile
        video.removeAttribute('muted');
        video.removeAttribute('autoplay'); // Disable autoplay on mobile for user control
        video.muted = false;
        video.defaultMuted = false;
        video.pause(); // Ensure video is paused initially
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');

        // Prevent video from autoplaying when scrolled into view
        // This stops any browser autoplay behavior
        video.addEventListener('play', function(e) {
            // If video starts playing without user interaction, pause it
            if (!wrapper.classList.contains('user-playing')) {
                video.pause();
            }
        });

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
                // Mark as user-initiated play
                wrapper.classList.add('user-playing');

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
                wrapper.classList.remove('user-playing');
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
                // Mark as user-initiated play
                wrapper.classList.add('user-playing');

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
                wrapper.classList.remove('user-playing');
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
                wrapper.classList.remove('user-playing');
                playBtn.style.display = 'flex';
                console.log('Video paused via touch, showing play button');
            } else {
                // Video is paused, resume playback
                wrapper.classList.add('user-playing');
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
                wrapper.classList.remove('user-playing');
                playBtn.style.display = 'flex';
                console.log('Video paused, showing play button');
            } else {
                // Video is paused, resume playback
                wrapper.classList.add('user-playing');
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
