/**
 * Desktop Video Hover - Handle video playback on hover for desktop
 * Only runs on desktop devices (width > 768px)
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only run on desktop
    if (window.innerWidth <= 768) return;

    // Get all animation video wrappers
    const videoWrappers = document.querySelectorAll('.gallery-image-wrapper.animation-video');

    videoWrappers.forEach(function(wrapper) {
        const video = wrapper.querySelector('video');
        const soundBtn = wrapper.querySelector('.sound-toggle-btn');

        if (!video) return;

        let audioCheckDone = false;

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
            // Method 3: Webkit - check audio decoded bytes
            else if (typeof video.webkitAudioDecodedByteCount !== 'undefined') {
                hasAudio = video.webkitAudioDecodedByteCount > 0;
            }

            video.setAttribute('data-has-audio', hasAudio ? 'true' : 'false');
            audioCheckDone = true;
            return hasAudio;
        };

        // Quick initial check on metadata
        video.addEventListener('loadedmetadata', function() {
            checkVideoAudio();
        });

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

        // Hover to play/pause
        const hasAutoplay = video.hasAttribute('autoplay');

        wrapper.addEventListener('mouseenter', function() {
            // Only start playing if not autoplay (autoplay videos are already playing)
            if (!hasAutoplay) {
                video.play().catch(err => {
                    console.log('Play prevented:', err);
                });
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

        wrapper.addEventListener('mouseleave', function() {
            // Only pause if not autoplay (autoplay videos should keep playing)
            if (!hasAutoplay) {
                video.pause();
                video.currentTime = 0; // Reset to start
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
    });
});
