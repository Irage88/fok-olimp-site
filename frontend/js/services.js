// Services page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Convert service.html?id=ID links to /service/ID format
    const serviceLinks = document.querySelectorAll('.btn-service-book');
    serviceLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes('service.html?id=')) {
            const serviceId = href.split('id=')[1].split('&')[0];
            link.setAttribute('href', `/service/${serviceId}`);
        }
    });
    
    // Add smooth scroll behavior for anchor links (if any)
    const detailLinks = document.querySelectorAll('.btn-service-details');
    detailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Allow default navigation, but could add analytics here
        });
    });
});


