/**
 * Mobile Carousel - Full-screen image carousel with swipe support and infinite loop
 * All carousels stack vertically with natural scroll
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile
    if (window.innerWidth > 768) return;

    const carousels = document.querySelectorAll('.mobile-carousel');
    if (carousels.length === 0) return;

    // Initialize each carousel
    carousels.forEach(function(carousel) {
        initCarousel(carousel);
    });

    function initCarousel(carousel) {
        const track = carousel.querySelector('.carousel-track');
        const originalSlides = Array.from(carousel.querySelectorAll('.carousel-slide'));

        if (!track || originalSlides.length === 0) return;

        // Clone first and last slides for infinite loop
        const firstClone = originalSlides[0].cloneNode(true);
        const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);

        // Add clones to track
        track.appendChild(firstClone);
        track.insertBefore(lastClone, originalSlides[0]);

        // Get all slides including clones
        const allSlides = track.querySelectorAll('.carousel-slide');
        const totalSlides = allSlides.length;

        // Get title element
        const category = carousel.getAttribute('data-category');
        const titleElement = document.getElementById('carousel-section-title-' + category);

        let currentSlide = 1; // Start at first real slide (after last clone)
        let touchStartX = 0;
        let touchEndX = 0;
        let isTransitioning = false;

        // Initialize position
        const viewportWidth = window.innerWidth;
        track.style.transform = `translateX(-${viewportWidth}px)`;

        // Update title text
        function updateTitle(index) {
            const slide = allSlides[index];
            if (slide && titleElement) {
                const title = slide.getAttribute('data-title');
                if (title) {
                    titleElement.textContent = title;
                }
            }
        }

        // Show specific slide with optional transition
        function showSlide(index, animate = true) {
            if (isTransitioning) return;

            if (!animate) {
                track.style.transition = 'none';
            } else {
                track.style.transition = 'transform 0.4s ease-out';
                isTransitioning = true;
            }

            // Move track - use viewport width calculation
            const viewportWidth = window.innerWidth;
            const offset = -index * viewportWidth;
            track.style.transform = `translateX(${offset}px)`;

            currentSlide = index;

            // Update title
            updateTitle(index);

            if (animate) {
                setTimeout(() => {
                    isTransitioning = false;
                }, 400);
            }
        }

        // Handle transition end for infinite loop
        track.addEventListener('transitionend', function() {
            if (currentSlide === 0) {
                // At last clone, jump to real last slide
                showSlide(totalSlides - 2, false);
            } else if (currentSlide === totalSlides - 1) {
                // At first clone, jump to real first slide
                showSlide(1, false);
            }
        });

        // Next slide
        function nextSlide() {
            showSlide(currentSlide + 1, true);
        }

        // Previous slide
        function prevSlide() {
            showSlide(currentSlide - 1, true);
        }

        // Touch events for swipe
        let isSwiping = false;
        let startTransform = 0;

        carousel.addEventListener('touchstart', function(e) {
            if (isTransitioning) return;
            touchStartX = e.changedTouches[0].clientX;
            isSwiping = true;

            // Get current transform value
            const style = window.getComputedStyle(track);
            const matrix = new DOMMatrix(style.transform);
            startTransform = matrix.m41;

            // Disable transition during drag
            track.style.transition = 'none';
        }, { passive: true });

        carousel.addEventListener('touchmove', function(e) {
            if (!isSwiping || isTransitioning) return;

            const currentX = e.changedTouches[0].clientX;
            const diff = currentX - touchStartX;

            // Only prevent default if it's a horizontal swipe
            if (Math.abs(diff) > Math.abs(e.changedTouches[0].clientY - e.changedTouches[0].clientY)) {
                e.preventDefault();
            }

            // Move track with finger
            const newTransform = startTransform + diff;
            track.style.transform = `translateX(${newTransform}px)`;
        }, { passive: false });

        carousel.addEventListener('touchend', function(e) {
            if (!isSwiping) return;
            touchEndX = e.changedTouches[0].clientX;
            isSwiping = false;

            // Re-enable transition
            track.style.transition = 'transform 0.4s ease-out';

            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swiped left - next slide
                    nextSlide();
                } else {
                    // Swiped right - previous slide
                    prevSlide();
                }
            } else {
                // Snap back to current slide
                showSlide(currentSlide, true);
            }
        }

        // Initialize title
        updateTitle(currentSlide);
    }
});
