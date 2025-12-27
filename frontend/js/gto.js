// GTO page JavaScript - Tab switching functionality

document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.gto-tab');
    const panels = document.querySelectorAll('.gto-panel');
    const defaultTab = 'school';

    // Initialize: Set default active tab
    activateTab(defaultTab);

    // Add click listeners to tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            activateTab(tabId);
        });

        // Keyboard support: Enter and Space
        tab.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const tabId = this.getAttribute('data-tab');
                activateTab(tabId);
            }
        });
    });

    // Activate tab function
    function activateTab(tabId) {
        // Update tabs
        tabs.forEach(tab => {
            const isActive = tab.getAttribute('data-tab') === tabId;
            tab.classList.toggle('gto-tab-active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Update panels with animation
        panels.forEach(panel => {
            const isActive = panel.id === `panel-${tabId}`;
            
            if (isActive) {
                // Show panel with fade-in
                panel.removeAttribute('hidden');
                panel.classList.add('gto-panel-active');
                // Trigger reflow for animation
                panel.offsetHeight;
                panel.style.opacity = '0';
                panel.style.transform = 'translateY(10px)';
                
                requestAnimationFrame(() => {
                    panel.style.transition = 'opacity 200ms var(--ease-out), transform 200ms var(--ease-out)';
                    panel.style.opacity = '1';
                    panel.style.transform = 'translateY(0)';
                });
            } else {
                // Hide panel with fade-out
                panel.style.transition = 'opacity 150ms var(--ease-out), transform 150ms var(--ease-out)';
                panel.style.opacity = '0';
                panel.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    panel.setAttribute('hidden', '');
                    panel.classList.remove('gto-panel-active');
                    panel.style.opacity = '';
                    panel.style.transform = '';
                    panel.style.transition = '';
                }, 150);
            }
        });
    }
});


