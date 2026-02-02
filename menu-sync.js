/**
 * Synchronize hover states between project grid items and sidebar menu
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get all project items and menu links
    const projectItems = document.querySelectorAll('.project-item');
    const menuLinks = document.querySelectorAll('.project-links a');

    // Create a map of href to menu link
    const menuLinkMap = {};
    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        menuLinkMap[href] = link;
    });

    // Add hover listeners to each project item
    projectItems.forEach(item => {
        const link = item.querySelector('a');
        if (!link) return;

        const href = link.getAttribute('href');
        const correspondingMenuLink = menuLinkMap[href];

        if (correspondingMenuLink) {
            // When hovering over project item, highlight menu link
            item.addEventListener('mouseenter', function() {
                correspondingMenuLink.classList.add('highlight');
            });

            item.addEventListener('mouseleave', function() {
                correspondingMenuLink.classList.remove('highlight');
            });
        }
    });
});
