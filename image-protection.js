/**
 * Image Protection
 * Prevents casual copying of images through right-click and drag-and-drop
 */

document.addEventListener('DOMContentLoaded', function() {
    // Disable right-click on all images
    document.addEventListener('contextmenu', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // Prevent dragging of images
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // Additional protection: prevent saving via keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Disable Ctrl+S / Cmd+S (save)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            if (document.activeElement.tagName === 'IMG' ||
                e.target.closest('.gallery-image-wrapper') ||
                e.target.closest('.project-thumbnail')) {
                e.preventDefault();
                return false;
            }
        }
    });
});
