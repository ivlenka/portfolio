/**
 * Mobile Scroll Spy - Highlights menu items based on visible carousel
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile
    if (window.innerWidth > 768) return;

    const mobileNav = document.querySelector('.mobile-nav');
    if (!mobileNav) return;

    const navLinks = mobileNav.querySelectorAll('a[data-section]');
    const carousels = document.querySelectorAll('.mobile-carousel');

    let ticking = false;

    function updateActiveNav() {
        const scrollPos = window.scrollY;
        const viewportHeight = window.innerHeight;

        // Find which carousel is currently most in view
        let currentCategory = null;
        let maxVisibility = 0;

        carousels.forEach(function(carousel) {
            const category = carousel.getAttribute('data-category');
            const rect = carousel.getBoundingClientRect();

            // Calculate how much of the carousel is visible
            const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
            const visibility = Math.max(0, visibleHeight / viewportHeight);

            if (visibility > maxVisibility) {
                maxVisibility = visibility;
                currentCategory = category;
            }
        });

        // Update nav items
        navLinks.forEach(link => {
            const sectionId = link.getAttribute('data-section');
            if (sectionId === currentCategory) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        ticking = false;
    }

    // Throttled scroll handler
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateActiveNav);
            ticking = true;
        }
    }

    // Smooth scroll on nav click
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            const carousel = document.querySelector(`.mobile-carousel[data-category="${sectionId}"]`);

            if (carousel) {
                carousel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Listen to scroll events
    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial call to set active state
    updateActiveNav();
});
