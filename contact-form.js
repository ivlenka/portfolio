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

                    // Reset viewport zoom on mobile
                    window.scrollTo(0, 0);

                    // Hide form title with fade out
                    if (formTitle) {
                        formTitle.style.transition = 'opacity 0.5s ease';
                        formTitle.style.opacity = '0';
                    }

                    // Hide form with fade out
                    form.style.transition = 'opacity 0.5s ease';
                    form.style.opacity = '0';

                    setTimeout(() => {
                        if (formTitle) {
                            formTitle.style.display = 'none';
                        }
                        form.style.display = 'none';
                        // Show success message with fade in
                        successMessage.classList.add('show');

                        // Additional viewport reset after message appears
                        window.scrollTo(0, 0);
                    }, 500);
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
