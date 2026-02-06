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

            if (video.paused) {
                video.play();
                playBtn.innerHTML = pauseIcon;
                playBtn.classList.add('playing');
            } else {
                video.pause();
                playBtn.innerHTML = playIcon;
                playBtn.classList.remove('playing');
            }
        });

        // Update button when video ends
        video.addEventListener('ended', function() {
            playBtn.innerHTML = playIcon;
            playBtn.classList.remove('playing');
        });

        // Prevent lightbox from opening when clicking on video
        wrapper.addEventListener('click', function(e) {
            if (e.target === video || e.target.closest('.mobile-play-btn')) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });
});
