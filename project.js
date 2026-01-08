// Project data - you can customize this with your actual project information
const projects = {
    brands: {
        category: 'BRANDS',
        title: 'Testarossa Winery',
        description: 'Highlighted text groovinghighlighted groovinghighlighted groovinghighlighted groovinghighlighted groovinghighlighted groovinghighlighted groovinghighlighted groovinghighlighted groovinghighlighted grooving highlighted groovinghighlighted grooving highlighted grooving highlighted grooving'
    },
    magazines: {
        category: 'MAGAZINES',
        title: 'Project Name',
        description: 'Add your project description here. Describe what the project is about, your role, and any interesting details about the work you did.'
    },
    prints: {
        category: 'PRINTS',
        title: 'Project Name',
        description: 'Add your project description here. Describe what the project is about, your role, and any interesting details about the work you did.'
    },
    digital: {
        category: 'DIGITAL',
        title: 'Project Name',
        description: 'Add your project description here. Describe what the project is about, your role, and any interesting details about the work you did.'
    },
    logos: {
        category: 'LOGOS',
        title: 'Project Name',
        description: 'Add your project description here. Describe what the project is about, your role, and any interesting details about the work you did.'
    },
    illustration: {
        category: 'ILLUSTRATION',
        title: 'Comic Illustration',
        description: 'Add your project description here. Describe what the project is about, your role, and any interesting details about the work you did.'
    },
    animation: {
        category: 'ANIMATION',
        title: 'Animation Project',
        description: 'Add your project description here. Describe what the project is about, your role, and any interesting details about the work you did.'
    },
    unsorted: {
        category: 'UNSORTED',
        title: 'Unsorted Project',
        description: 'Add your project description here. Describe what the project is about, your role, and any interesting details about the work you did.'
    }
};

// Get project ID from URL
function getProjectId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || 'brands';
}

// Load project content
function loadProject() {
    const projectId = getProjectId();
    const project = projects[projectId];

    if (project) {
        document.getElementById('categoryTitle').textContent = project.category;
        document.getElementById('projectTitle').textContent = project.title;
        document.getElementById('projectDescription').textContent = project.description;

        // Custom content for illustration project
        if (projectId === 'illustration') {
            const projectImagesDiv = document.querySelector('.project-images');
            projectImagesDiv.innerHTML = `
                <div class="image-block">
                    <div class="mosaic-layout mosaic-general">
                        <img src="images/comic/comic-general/comic1.jpg" alt="Comic 1">
                        <img src="images/comic/comic-general/comic2.jpg" alt="Comic 2">
                        <img src="images/comic/comic-general/comic3.jpg" alt="Comic 3">
                        <img src="images/comic/comic-general/comic4.jpg" alt="Comic 4">
                        <img src="images/comic/comic-general/comic5.jpg" alt="Comic 5">
                    </div>
                </div>
            `;
        }
    }
}

// Load project when page loads
window.addEventListener('DOMContentLoaded', loadProject);
