document.addEventListener('DOMContentLoaded', function() {
    // Check for thankyou query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const showThankYou = urlParams.get('thankyou');
    
    if (showThankYou !== null) {
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.style.display = 'block';
        }
    }
});
