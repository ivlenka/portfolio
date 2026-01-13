// Smooth hover transition for cover images
(function() {
    const projectItems = document.querySelectorAll('.project-item');

    projectItems.forEach(item => {
        const thumbnail = item.querySelector('.project-thumbnail');
        if (!thumbnail) return;

        let isHovering = false;
        let resetTimeout = null;

        item.addEventListener('mouseenter', function() {
            isHovering = true;

            // Clear any pending reset
            if (resetTimeout) {
                clearTimeout(resetTimeout);
                resetTimeout = null;
            }

            // Get the current computed transform value
            const computedStyle = window.getComputedStyle(thumbnail);
            const currentTransform = computedStyle.transform;

            // Freeze the current transform as inline style
            thumbnail.style.transform = currentTransform;

            // Remove the animation
            thumbnail.style.animation = 'none';

            // Wait for next frame to allow the browser to process the freeze
            requestAnimationFrame(() => {
                // Now transition to the target scale
                thumbnail.style.transition = 'filter 0s, transform 1.2s ease-out';
                thumbnail.style.transform = 'scale(1.6)';
            });
        });

        item.addEventListener('mouseleave', function() {
            isHovering = false;

            // Get current transform before reverting
            const computedStyle = window.getComputedStyle(thumbnail);
            const currentTransform = computedStyle.transform;

            // Freeze current state
            thumbnail.style.transform = currentTransform;

            // Wait for next frame
            requestAnimationFrame(() => {
                // Transition back to scale(1)
                thumbnail.style.transition = 'filter 0s, transform 1.2s ease-out';
                thumbnail.style.transform = 'scale(1)';

                // After transition completes, re-enable the animation only if not hovering
                resetTimeout = setTimeout(() => {
                    if (!isHovering) {
                        thumbnail.style.animation = '';
                        thumbnail.style.transform = '';
                        thumbnail.style.transition = '';
                    }
                    resetTimeout = null;
                }, 1200);
            });
        });
    });
})();
