// Homepage cover image rotation
(function() {
    // Map project IDs to gallery data keys
    const projectMapping = {
        'brands': '1-brands',
        'magazines': '2-magazines',
        'prints': '3-print',
        'digital': '4-digital',
        'logos': '5-logos',
        'illustration': '6-illustrations',
        'animation': '7-animation',
        'unsorted': '8-unsorted'
    };

    // Store all images for each project
    const projectImages = {};

    // Get random image from array, excluding video files
    function getRandomImage(images) {
        const imageFiles = images.filter(img => {
            const ext = img.toLowerCase().split('.').pop();
            return ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
        });
        if (imageFiles.length === 0) return null;
        return imageFiles[Math.floor(Math.random() * imageFiles.length)];
    }

    // Change cover image for a specific project with dissolve effect
    function changeCoverImage(projectId, imgElement) {
        const images = projectImages[projectId];
        if (!images || images.length === 0) return;

        const newImage = getRandomImage(images);
        if (newImage) {
            // Fade out
            imgElement.style.opacity = '0';

            // Change image and fade in after transition
            setTimeout(() => {
                imgElement.src = newImage;
                imgElement.style.opacity = '1';
            }, 1000); // Wait for fade out to complete
        }
    }

    // Load gallery data and set up rotation
    fetch('gallery-data.json')
        .then(response => response.json())
        .then(data => {
            // Collect all images for each project
            Object.entries(projectMapping).forEach(([projectId, galleryKey]) => {
                const project = data.projects[galleryKey];
                if (!project) return;

                const allImages = [];
                Object.values(project.sections).forEach(section => {
                    if (section.images) {
                        allImages.push(...section.images);
                    }
                });

                projectImages[projectId] = allImages;
            });

            // Set up rotation for each cover
            const projectItems = document.querySelectorAll('.project-item');
            projectItems.forEach((item, index) => {
                const link = item.querySelector('a');
                const img = item.querySelector('.project-thumbnail img');

                if (!link || !img) return;

                // Extract project ID from link
                const href = link.getAttribute('href');
                const match = href.match(/id=([^&]+)/);
                if (!match) return;

                const projectId = match[1];

                // Change image every 15-30 seconds (random interval per cover)
                const interval = 15000 + Math.random() * 15000;
                setInterval(() => {
                    changeCoverImage(projectId, img);
                }, interval);
            });
        })
        .catch(error => {
            console.error('Error loading gallery data:', error);
        });
})();
