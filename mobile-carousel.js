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

    // Map category names to project page URLs
    const categoryToPage = {
        'brands': 'project-brands.html',
        'magazines': 'project-magazines.html',
        'prints': 'project-prints.html',
        'digital': 'project-digital.html',
        'logos': 'project-logos.html',
        'illustration': 'project-illustration.html',
        'animation': 'project-animation.html',
        'display': 'project-unsorted.html'
    };

    // Initialize each carousel
    const carouselControllers = [];
    carousels.forEach(function(carousel) {
        const controller = initCarousel(carousel);
        carouselControllers.push(controller);

        // Add click handler to navigate to project page
        const category = carousel.getAttribute('data-category');
        const pageUrl = categoryToPage[category];

        if (pageUrl) {
            carousel.addEventListener('click', function(e) {
                // Only navigate if clicking on the carousel itself or slides, not overlay text
                if (!e.target.closest('.carousel-overlay')) {
                    window.location.href = pageUrl;
                }
            });

            // Add cursor pointer style
            carousel.style.cursor = 'pointer';
        }
    });

    function initCarousel(carousel) {
        const track = carousel.querySelector('.carousel-track');
        const originalSlides = Array.from(carousel.querySelectorAll('.carousel-slide'));

        if (!track || originalSlides.length === 0) return null;

        // Clone all slides THREE times for seamless infinite loop
        // This ensures we always have content visible during transitions
        const allSlidesArray = [...originalSlides];

        // Add two more full sets of clones
        for (let i = 0; i < 2; i++) {
            originalSlides.forEach(function(slide) {
                const clone = slide.cloneNode(true);
                track.appendChild(clone);
                allSlidesArray.push(clone);
            });
        }

        const realSlidesCount = originalSlides.length;
        const totalSlides = allSlidesArray.length;

        // Start in the middle set to allow seamless looping in both directions
        let currentSlide = realSlidesCount;
        let isTransitioning = false;
        let autoPlayInterval = null;
        let isActive = false;

        // Calculate slide width (50% of viewport)
        const slideWidth = window.innerWidth * 0.5;

        // Initialize position - start at middle set
        track.style.transition = 'none';
        const initialOffset = -currentSlide * slideWidth;
        track.style.transform = `translateX(${initialOffset}px)`;

        // Force reflow to ensure initial position is set
        void track.offsetWidth;

        // Mark initial slide as active
        updateActiveSlide(currentSlide);

        // Update active slide class
        function updateActiveSlide(index) {
            // Remove active class from all slides
            allSlidesArray.forEach(function(slide) {
                slide.classList.remove('active');
            });

            // Add active class to current slide
            if (allSlidesArray[index]) {
                allSlidesArray[index].classList.add('active');
            }
        }

        // Show specific slide with optional transition
        function showSlide(index, animate = true) {
            if (!animate) {
                track.style.transition = 'none';
                currentSlide = index;
                const offset = -index * slideWidth;
                track.style.transform = `translateX(${offset}px)`;

                // Force reflow
                void track.offsetWidth;

                isTransitioning = false;

                // Update active slide
                updateActiveSlide(index);
            } else {
                track.style.transition = 'transform 0.8s ease-in-out';
                currentSlide = index;
                isTransitioning = true;

                const offset = -index * slideWidth;
                track.style.transform = `translateX(${offset}px)`;

                // Update active slide
                updateActiveSlide(index);
            }
        }

        // Handle transition end for infinite loop
        track.addEventListener('transitionend', function(e) {
            if (e.target !== track) return;

            isTransitioning = false;

            // If we're in the last set, jump to middle set
            if (currentSlide >= realSlidesCount * 2) {
                const equivalentSlide = currentSlide - realSlidesCount;

                // Disable all transitions temporarily
                track.classList.add('no-transition');
                track.style.transition = 'none';

                currentSlide = equivalentSlide;
                const offset = -equivalentSlide * slideWidth;
                track.style.transform = `translateX(${offset}px)`;

                // Update active slide immediately (before reflow)
                updateActiveSlide(equivalentSlide);

                // Force reflow
                void track.offsetWidth;

                // Re-enable transitions after a brief delay
                setTimeout(function() {
                    track.classList.remove('no-transition');
                    track.style.transition = 'transform 0.8s ease-in-out';
                }, 50);
            }
            // If we're in the first set, jump to middle set
            else if (currentSlide < realSlidesCount) {
                const equivalentSlide = currentSlide + realSlidesCount;

                // Disable all transitions temporarily
                track.classList.add('no-transition');
                track.style.transition = 'none';

                currentSlide = equivalentSlide;
                const offset = -equivalentSlide * slideWidth;
                track.style.transform = `translateX(${offset}px)`;

                // Update active slide immediately (before reflow)
                updateActiveSlide(equivalentSlide);

                // Force reflow
                void track.offsetWidth;

                // Re-enable transitions after a brief delay
                setTimeout(function() {
                    track.classList.remove('no-transition');
                    track.style.transition = 'transform 0.8s ease-in-out';
                }, 50);
            }
        });

        // Next slide
        function nextSlide() {
            if (!isTransitioning && isActive) {
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
            // Immediately advance to next slide when activated
            nextSlide();
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
