/**
 * Mobile Project Gallery - Show more functionality per section
 * Only runs on mobile devices
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile
    if (window.innerWidth > 768) {
        console.log('Desktop mode - skipping mobile gallery script');
        return;
    }

    console.log('Mobile gallery script starting...');

    // Run after a small delay to ensure all elements are loaded
    setTimeout(function() {
        console.log('Timeout executed, searching for sections...');
        const sections = document.querySelectorAll('.gallery-section');

        console.log('Found ' + sections.length + ' sections');

        sections.forEach(function(section, sectionIndex) {
            console.log('\n=== Processing Section ' + sectionIndex + ' ===');

            const layout = section.querySelector('.bin-packed-layout');
            if (!layout) {
                console.log('ERROR: Section ' + sectionIndex + ' has no layout');
                return;
            }
            console.log('Section ' + sectionIndex + ' layout found');

            const allImages = Array.from(layout.querySelectorAll('.gallery-image-wrapper'));
            const imagesPerLoad = 10;
            let currentlyVisible = 0;

            console.log('Section ' + sectionIndex + ' has ' + allImages.length + ' images');
            console.log('Will create button: ' + (allImages.length > imagesPerLoad));

            // Only proceed if there are images
            if (allImages.length === 0) return;

            // Hide all images initially (use important to override any existing styles)
            allImages.forEach(function(img, index) {
                img.style.setProperty('display', 'none', 'important');
                img.classList.add('mobile-hidden');
            });

        // Function to show next batch
        function showNextBatch() {
            const endIndex = Math.min(currentlyVisible + imagesPerLoad, allImages.length);

            for (let i = currentlyVisible; i < endIndex; i++) {
                allImages[i].style.setProperty('display', 'block', 'important');
                allImages[i].classList.remove('mobile-hidden');
                allImages[i].classList.add('mobile-visible');
            }

            currentlyVisible = endIndex;

            console.log('Now showing ' + currentlyVisible + ' of ' + allImages.length + ' images');

            // Hide button if all images are shown
            if (currentlyVisible >= allImages.length && seeMoreContainer) {
                seeMoreContainer.style.setProperty('display', 'none', 'important');
                console.log('Hiding button - all images shown');
            }
        }

        // Create new mobile "See more" button only if needed
        let seeMoreContainer = null;
        let seeMoreBtn = null;

        if (allImages.length > imagesPerLoad) {
            console.log('>>> Creating button for section ' + sectionIndex);

            // Always create new button for mobile
            seeMoreContainer = document.createElement('div');
            seeMoreContainer.className = 'mobile-see-more-container';
            console.log('Created container element');

            seeMoreBtn = document.createElement('button');
            seeMoreBtn.className = 'mobile-see-more-btn';
            seeMoreBtn.textContent = 'See more';
            console.log('Created button element');

            seeMoreContainer.appendChild(seeMoreBtn);
            console.log('Appended button to container');

            // Append button to the end of the gallery section
            // This is more reliable than trying to insert after layout
            section.appendChild(seeMoreContainer);
            console.log('Appended container to section');

            // Handle button click
            seeMoreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('!!! Button clicked in section ' + sectionIndex);
                const scrollPosition = window.pageYOffset;
                showNextBatch();

                // Smooth scroll to first newly revealed image
                setTimeout(function() {
                    const firstNewImage = allImages[currentlyVisible - imagesPerLoad];
                    if (firstNewImage) {
                        const imageTop = firstNewImage.getBoundingClientRect().top + window.pageYOffset;
                        window.scrollTo({
                            top: Math.max(scrollPosition, imageTop - 160),
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            });
            console.log('Click handler attached to button');
        } else {
            console.log('Section ' + sectionIndex + ' has ' + allImages.length + ' images (<= 10), no button needed');
        }

        // Show first batch
        console.log('Calling showNextBatch for first batch in section ' + sectionIndex);
        showNextBatch();
        console.log('=== Section ' + sectionIndex + ' complete ===\n');
        });
    }, 100);
});
