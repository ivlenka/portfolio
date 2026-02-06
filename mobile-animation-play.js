/**
 * Mobile Animation Play - Add play buttons to animation videos on mobile
 * Only runs on animation project page on mobile devices
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile
    if (window.innerWidth > 768) return;

    // Only run on animation project page
    if (!window.location.pathname.includes('project-animation')) return;

    const animationVideos = document.querySelectorAll('.gallery-image-wrapper.animation-video video');

    animationVideos.forEach(function(video) {
        const wrapper = video.closest('.gallery-image-wrapper');

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

        // Handle play/pause
        playBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (video.paused) {
                // Remove muted attribute and ensure audio
                video.removeAttribute('muted');
                video.muted = false;
                video.volume = 1.0;

                console.log('Playing video with sound:', {
                    muted: video.muted,
                    volume: video.volume,
                    hasAudio: video.mozHasAudio || video.webkitAudioDecodedByteCount > 0
                });

                video.play().then(function() {
                    console.log('Video playing successfully');
                    playBtn.style.display = 'none';
                }).catch(function(error) {
                    console.log('Play error:', error);
                    // Try again with user interaction
                    video.muted = false;
                    video.play();
                    playBtn.style.display = 'none';
                });
            } else {
                video.pause();
                playBtn.style.display = 'flex';
            }
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
    });
});
