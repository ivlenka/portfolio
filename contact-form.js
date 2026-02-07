// Contact Form Submission Handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const formTitle = document.querySelector('.contact-form-title');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const submitButton = form.querySelector('.submit-button');
            const originalButtonText = submitButton.textContent;

            // Add default subject if user didn't provide one
            const subjectField = document.getElementById('subject');
            if (!subjectField.value || subjectField.value.trim() === '') {
                formData.set('subject', 'New message from Portfolio website');
            }

            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    // Blur any focused input to reset mobile zoom
                    if (document.activeElement) {
                        document.activeElement.blur();
                    }

                    // Force viewport zoom reset on mobile - multiple techniques for Safari
                    const viewport = document.querySelector('meta[name=viewport]');
                    if (viewport) {
                        const originalContent = viewport.getAttribute('content');
                        // Temporarily disable zoom to force reset
                        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');

                        // Multiple resets for Safari iOS
                        setTimeout(() => {
                            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
                        }, 50);

                        setTimeout(() => {
                            viewport.setAttribute('content', originalContent);
                        }, 150);
                    }

                    // Multiple scroll resets for Safari
                    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                    setTimeout(() => {
                        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                    }, 50);

                    // Hide form and title immediately (no fade)
                    if (formTitle) {
                        formTitle.style.display = 'none';
                    }
                    form.style.display = 'none';

                    // Show success message immediately
                    successMessage.classList.add('show');

                    // Additional scroll resets after message appears for Safari
                    setTimeout(() => {
                        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                    }, 50);

                    // Final scroll reset after a short delay
                    setTimeout(() => {
                        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                    }, 100);
                } else {
                    // Show error message
                    alert('There was an error sending your message. Please try again or email directly to olena@kovtash.com');
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            } catch (error) {
                // Show error message
                alert('There was an error sending your message. Please try again or email directly to olena@kovtash.com');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
});
