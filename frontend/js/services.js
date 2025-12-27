// Services page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Note: Booking buttons are now <a> links with href attributes
    // They will navigate naturally to service.html?id=<service-id>
    // No JavaScript intervention needed for navigation
    
    // Add smooth scroll behavior for anchor links (if any)
    const detailLinks = document.querySelectorAll('.btn-service-details');
    detailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Allow default navigation, but could add analytics here
        });
    });
});


