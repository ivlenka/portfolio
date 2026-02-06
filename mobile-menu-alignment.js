/**
 * Mobile Menu Alignment - Dynamically detect and mark row start/end items
 */

function updateMenuAlignment() {
    const nav = document.querySelector('.mobile-nav');
    if (!nav || window.innerWidth > 768) return;

    const items = Array.from(nav.querySelectorAll('a'));
    if (items.length === 0) return;

    // Remove all existing classes
    items.forEach(item => {
        item.classList.remove('row-start', 'row-end');
    });

    // Get vertical positions to detect rows
    let currentTop = null;
    let rowStartIndex = 0;

    items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const itemTop = Math.round(rect.top);

        // New row detected
        if (currentTop === null || itemTop > currentTop) {
            // Mark previous item as row-end
            if (index > 0) {
                items[index - 1].classList.add('row-end');
            }
            // Mark current item as row-start
            item.classList.add('row-start');
            rowStartIndex = index;
            currentTop = itemTop;
        }
    });

    // Mark last item as row-end
    if (items.length > 0) {
        items[items.length - 1].classList.add('row-end');
    }
}

// Run on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateMenuAlignment);
} else {
    updateMenuAlignment();
}

// Update on resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateMenuAlignment, 100);
});
