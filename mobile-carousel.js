/**
 * Mobile Carousel - Auto-playing image carousel with infinite loop
 * Only carousel in center of viewport plays automatically
 * No horizontal swiping - images change automatically
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile
    if (window.innerWidth > 768) return;

    const carousels = document.querySelectorAll('.mobile-carousel');
    if (carousels.length === 0) return;

    let activeCarousel = null;

    // Initialize each carousel
    const carouselControllers = [];
    carousels.forEach(function(carousel) {
        const controller = initCarousel(carousel);
        carouselControllers.push(controller);
    });

    function initCarousel(carousel) {
        const track = carousel.querySelector('.carousel-track');
        const originalSlides = Array.from(carousel.querySelectorAll('.carousel-slide'));

        if (!track || originalSlides.length === 0) return null;

        // Clone all slides for seamless infinite loop
        const clones = [];
        originalSlides.forEach(function(slide) {
            const clone = slide.cloneNode(true);
            track.appendChild(clone);
            clones.push(clone);
        });

        // Get all slides including clones
        const allSlides = track.querySelectorAll('.carousel-slide');
        const realSlidesCount = originalSlides.length;
        const totalSlides = allSlides.length;

        let currentSlide = 1; // Start at second image to avoid white space
        let isTransitioning = false;
        let autoPlayInterval = null;
        let isActive = false;

        // Calculate slide width (50% of viewport)
        const slideWidth = window.innerWidth * 0.5;

        // Initialize position - start at second image to fill visible area
        track.style.transition = 'none';
        track.style.transform = `translateX(-${slideWidth}px)`;

        // Force reflow to ensure initial position is set
        void track.offsetWidth;

        // Show specific slide with optional transition
        function showSlide(index, animate = true) {
            if (!animate) {
                track.style.transition = 'none';
                isTransitioning = false;
            } else {
                track.style.transition = 'transform 0.8s ease-in-out';
                isTransitioning = true;
            }

            // Move track - use slide width (50vw)
            const offset = -index * slideWidth;
            track.style.transform = `translateX(${offset}px)`;

            currentSlide = index;

            if (animate) {
                setTimeout(() => {
                    isTransitioning = false;
                }, 800);
            } else {
                // Force reflow to ensure no-transition takes effect
                void track.offsetWidth;
            }
        }

        // Handle transition end for infinite loop
        track.addEventListener('transitionend', function(e) {
            if (e.target !== track) return;

            // If we've reached the cloned section, jump back to start
            if (currentSlide >= realSlidesCount) {
                const jumpToSlide = currentSlide - realSlidesCount;
                showSlide(jumpToSlide, false);
            }
        });

        // Next slide
        function nextSlide() {
            if (!isTransitioning) {
                showSlide(currentSlide + 1, true);
            }
        }

        // Start auto-play
        function startAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
            }
            autoPlayInterval = setInterval(function() {
                if (isActive && !isTransitioning) {
                    nextSlide();
                }
            }, 3000);
        }

        // Stop auto-play
        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        // Activate this carousel
        function activate() {
            isActive = true;
            startAutoPlay();
        }

        // Deactivate this carousel
        function deactivate() {
            isActive = false;
            stopAutoPlay();
        }

        return {
            element: carousel,
            activate: activate,
            deactivate: deactivate
        };
    }

    // Check which carousel is in the center of the viewport
    function updateActiveCarousel() {
        const viewportCenter = window.innerHeight / 2;
        let closestCarousel = null;
        let closestDistance = Infinity;

        carouselControllers.forEach(function(controller) {
            if (!controller) return;

            const rect = controller.element.getBoundingClientRect();
            const carouselCenter = rect.top + rect.height / 2;
            const distance = Math.abs(carouselCenter - viewportCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestCarousel = controller;
            }
        });

        // Activate the closest carousel, deactivate others
        if (closestCarousel !== activeCarousel) {
            if (activeCarousel) {
                activeCarousel.deactivate();
            }
            activeCarousel = closestCarousel;
            if (activeCarousel) {
                activeCarousel.activate();
            }
        }
    }

    // Initial check
    updateActiveCarousel();

    // Update on scroll
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveCarousel, 100);
    }, { passive: true });

    // Update on visibility change
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (activeCarousel) {
                activeCarousel.deactivate();
            }
        } else {
            updateActiveCarousel();
        }
    });
});
