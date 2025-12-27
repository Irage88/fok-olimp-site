// Login form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const submitBtn = document.getElementById('submitBtn');

    // Password toggle functionality
    passwordToggle.addEventListener('click', function(e) {
        e.preventDefault();
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Update aria-label
        const isVisible = type === 'text';
        passwordToggle.setAttribute('aria-label', isVisible ? 'Скрыть пароль' : 'Показать пароль');
    });

    // Validation functions
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        return password.length >= 1; // Just check that password is not empty
    }

    // Show error function
    function showError(inputId, errorId, message) {
        const input = document.getElementById(inputId);
        const errorElement = document.getElementById(errorId);
        
        input.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    // Clear error function
    function clearError(inputId, errorId) {
        const input = document.getElementById(inputId);
        const errorElement = document.getElementById(errorId);
        
        input.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    // Real-time validation
    emailInput.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            showError('email', 'emailError', 'Введите корректный email адрес');
        } else {
            clearError('email', 'emailError');
        }
    });

    passwordInput.addEventListener('blur', function() {
        if (this.value && !validatePassword(this.value)) {
            showError('password', 'passwordError', 'Пароль обязателен для заполнения');
        } else {
            clearError('password', 'passwordError');
        }
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Clear previous errors
        const allErrors = document.querySelectorAll('.form-error');
        allErrors.forEach(error => error.textContent = '');
        const allInputs = form.querySelectorAll('.form-input');
        allInputs.forEach(input => input.classList.remove('error'));

        // Validate all fields
        let isValid = true;

        if (!validateEmail(emailInput.value)) {
            showError('email', 'emailError', 'Введите корректный email адрес');
            isValid = false;
        }

        if (!validatePassword(passwordInput.value)) {
            showError('password', 'passwordError', 'Пароль обязателен для заполнения');
            isValid = false;
        }

        if (!isValid) {
            // Focus first error field
            const firstError = form.querySelector('.form-input.error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.textContent = '';

        // Call backend API
        try {
            const response = await fetch(`${window.API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailInput.value,
                    password: passwordInput.value
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store token
            if (data.success && data.data && data.data.token) {
                localStorage.setItem('token', data.data.token);
                
                // Update global auth UI
                if (window.updateAuthUI) {
                    window.updateAuthUI();
                }
                
                // Redirect to dashboard
                window.location.href = './dashboard.html';
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            // Remove loading state
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Войти';

            // Show error
            showError('password', 'passwordError', error.message || 'Ошибка входа. Проверьте email и пароль.');
        }
    });

    // Clear errors on input
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const errorId = this.id + 'Error';
            clearError(this.id, errorId);
        });
    });
});



