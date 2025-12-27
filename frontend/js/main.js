// Main JavaScript file for ФОК "Олимп"

// Global auth UI management
function updateAuthUI() {
    const token = localStorage.getItem('token');
    const headerButtons = document.querySelector('.header-buttons');
    
    if (!headerButtons) return;
    
    // Find login and register buttons
    const loginBtn = Array.from(headerButtons.querySelectorAll('a')).find(
        btn => btn.textContent.trim() === 'Войти' && btn.classList.contains('btn-outline')
    );
    const registerBtn = Array.from(headerButtons.querySelectorAll('a')).find(
        btn => btn.textContent.trim() === 'Регистрация' && btn.classList.contains('btn-primary')
    );
    const dashboardBtn = Array.from(headerButtons.querySelectorAll('a')).find(
        btn => btn.textContent.trim() === 'Личный кабинет' || btn.href.includes('dashboard.html')
    );
    
    const logoutBtn = document.getElementById('logoutBtn') || headerButtons.querySelector('#logoutBtn');
    
    if (token) {
        // User is logged in: hide login/register, show dashboard and logout
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (dashboardBtn) {
            dashboardBtn.style.display = '';
            dashboardBtn.href = './dashboard.html';
            if (!dashboardBtn.textContent.includes('Личный кабинет')) {
                dashboardBtn.textContent = 'Личный кабинет';
                dashboardBtn.classList.remove('btn-outline');
                dashboardBtn.classList.add('btn-primary');
            }
        } else {
            // Create dashboard button if it doesn't exist
            const newDashboardBtn = document.createElement('a');
            newDashboardBtn.href = './dashboard.html';
            newDashboardBtn.className = 'btn btn-primary';
            newDashboardBtn.textContent = 'Личный кабинет';
            headerButtons.appendChild(newDashboardBtn);
        }
        if (logoutBtn) logoutBtn.style.display = '';
    } else {
        // User is not logged in: show login/register, hide dashboard and logout
        if (loginBtn) loginBtn.style.display = '';
        if (registerBtn) registerBtn.style.display = '';
        if (dashboardBtn) dashboardBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Update auth UI on page load
    updateAuthUI();
    // Active page highlighting
    const currentPage = document.body.getAttribute('data-page');
    if (currentPage) {
        const pageMap = {
            'index': './index.html',
            'about': './about.html',
            'services': './services.html',
            'gto': './gto.html',
            'contacts': './contacts.html',
            'login': './login.html',
            'register': './register.html',
            'dashboard': './dashboard.html',
            'service': './services.html' // Service detail page should highlight Services
        };
        
        const currentPath = pageMap[currentPage];
        if (currentPath) {
            // Highlight nav link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('is-active');
                }
            });
            
            // Highlight header button if it's a login/register/dashboard page
            if (currentPage === 'login') {
                const loginBtn = document.querySelector('.header-buttons .btn-outline');
                if (loginBtn && loginBtn.textContent.trim() === 'Войти') {
                    loginBtn.classList.add('is-active');
                }
            } else if (currentPage === 'register') {
                const registerBtn = document.querySelector('.header-buttons .btn-primary');
                if (registerBtn && registerBtn.textContent.trim() === 'Регистрация') {
                    registerBtn.classList.add('is-active');
                }
            } else if (currentPage === 'dashboard') {
                const dashboardBtn = document.querySelector('.header-buttons .btn-primary');
                if (dashboardBtn && dashboardBtn.textContent.trim() === 'Личный кабинет') {
                    dashboardBtn.classList.add('is-active');
                }
            }
        }
    }
    
    // Add smooth scroll behavior to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = 100; // Header height in pixels
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Button click handlers (placeholder for future functionality)
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            
            // Log button clicks for debugging (can be removed in production)
            console.log('Button clicked:', buttonText);
            
            // Add specific handlers for different buttons
            if (buttonText === 'Войти' || buttonText === 'Регистрация') {
                // Handle login/registration
                // This would typically open a modal or navigate to a login page
                console.log('Login/Registration clicked');
            } else if (buttonText === 'Узнать больше') {
                // Scroll to services section
                const servicesSection = document.querySelector('.services');
                if (servicesSection) {
                    const headerHeight = 100;
                    const targetPosition = servicesSection.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            } else if (buttonText === 'Посмотреть услуги') {
                // Scroll to services section
                const servicesSection = document.querySelector('.services');
                if (servicesSection) {
                    const headerHeight = 100;
                    const targetPosition = servicesSection.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            } else if (buttonText === 'Оплатить') {
                // Handle payment (would typically open payment modal or redirect)
                console.log('Payment button clicked');
                alert('Функция оплаты в разработке');
            } else if (buttonText === 'Как добраться') {
                // Handle "How to get there" (could open map or modal)
                console.log('How to get there clicked');
                // This could open a map modal or redirect to a map page
            } else if (buttonText === 'Написать') {
                // Handle "Write" button (could open contact form)
                console.log('Write button clicked');
                // This could open a contact form modal
            }
        });
    });

    // Service card hover effects (optional enhancement)
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // News card hover effects (optional enhancement)
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Header scroll effect (optional enhancement)
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow on scroll
        if (currentScroll > 10) {
            header.style.boxShadow = '0px 4px 8px 0px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.25)';
        }
        
        lastScroll = currentScroll;
    });
});

// Logout function
function logout() {
    localStorage.removeItem('token');
    updateAuthUI();
    window.location.href = './login.html';
}

// Export functions for use in other scripts
window.updateAuthUI = updateAuthUI;
window.logout = logout;





