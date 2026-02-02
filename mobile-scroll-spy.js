/**
 * Mobile Scroll Spy - Highlights menu items based on visible sections
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile
    if (window.innerWidth > 768) return;

    const mobileNav = document.querySelector('.mobile-nav');
    if (!mobileNav) return;

    const navLinks = mobileNav.querySelectorAll('a[data-section]');
    const sections = Array.from(navLinks).map(link => {
        const sectionId = link.getAttribute('data-section');
        return document.getElementById(sectionId);
    }).filter(section => section !== null);

    let ticking = false;

    function updateActiveNav() {
        // Find which section is currently most visible
        const scrollPos = window.scrollY + window.innerHeight / 3; // Check upper third of viewport

        let currentSection = null;

        // Find the first section that hasn't been scrolled past yet
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section && section.offsetTop <= scrollPos) {
                currentSection = section.id;
                break;
            }
        }

        // If we're at the very top, select the first section
        if (window.scrollY < 100) {
            currentSection = sections[0]?.id;
        }

        // Update nav items
        navLinks.forEach(link => {
            const sectionId = link.getAttribute('data-section');
            if (sectionId === currentSection) {
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
            const section = document.getElementById(sectionId);

            if (section) {
                const headerHeight = 100; // Fixed header height
                const targetPos = section.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Listen to scroll events
    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial call to set active state
    updateActiveNav();
});
