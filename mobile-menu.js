/**
 * Mobile Menu - Toggle burger menu slide from right
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile
    if (window.innerWidth > 768) return;

    const menuToggle = document.getElementById('mobile-menu-toggle');
    const burgerMenu = document.getElementById('mobile-burger-menu');
    const menuOverlay = document.getElementById('mobile-menu-overlay');

    if (!menuToggle || !burgerMenu || !menuOverlay) return;

    // Toggle menu on click
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        burgerMenu.classList.toggle('show');
        menuOverlay.classList.toggle('show');
    });

    // Close menu when clicking overlay
    menuOverlay.addEventListener('click', function() {
        burgerMenu.classList.remove('show');
        menuOverlay.classList.remove('show');
    });

    // Close menu when clicking a link
    const menuLinks = burgerMenu.querySelectorAll('a');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            burgerMenu.classList.remove('show');
            menuOverlay.classList.remove('show');
        });
    });
});
