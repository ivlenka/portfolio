/**
 * Mobile Animation GIFs - Autoplay GIFs and disable lightbox
 * Only runs on mobile devices for animation project
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile
    if (window.innerWidth > 768) {
        return;
    }

    // Find all GIF images in the gallery
    const allImageWrappers = document.querySelectorAll('.gallery-image-wrapper');

    allImageWrappers.forEach(function(wrapper) {
        const img = wrapper.querySelector('img[data-full-src]');

        if (img) {
            const fullSrc = img.getAttribute('data-full-src');

            // Check if it's a GIF
            if (fullSrc && fullSrc.toLowerCase().endsWith('.gif')) {
                // Replace thumbnail with actual GIF
                img.src = fullSrc;

                // Remove click handler by preventing clicks
                wrapper.style.cursor = 'default';
                wrapper.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                }, true);

                // Remove data-index to prevent lightbox from tracking it
                wrapper.removeAttribute('data-index');
            }
        }
    });
});
