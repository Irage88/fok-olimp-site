// Registration form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordToggle = document.getElementById('passwordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    const phoneInput = document.getElementById('phone');
    const submitBtn = document.getElementById('submitBtn');

    // Password toggle functionality
    function setupPasswordToggle(toggleBtn, input) {
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Update aria-label
            const isVisible = type === 'text';
            toggleBtn.setAttribute('aria-label', isVisible ? 'Скрыть пароль' : 'Показать пароль');
        });
    }

    setupPasswordToggle(passwordToggle, passwordInput);
    setupPasswordToggle(confirmPasswordToggle, confirmPasswordInput);

    // Phone number formatting
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.startsWith('8')) {
            value = '7' + value.substring(1);
        }
        
        if (value.startsWith('7')) {
            let formatted = '+7 (';
            if (value.length > 1) {
                formatted += value.substring(1, 4);
            }
            if (value.length >= 4) {
                formatted += ') ' + value.substring(4, 7);
            }
            if (value.length >= 7) {
                formatted += '-' + value.substring(7, 9);
            }
            if (value.length >= 9) {
                formatted += '-' + value.substring(9, 11);
            }
            e.target.value = formatted;
        } else if (value.length > 0) {
            e.target.value = '+7 (' + value;
        }
    });

    // Validation functions
    function validateName(name) {
        return name.trim().length >= 2 && /^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(name.trim());
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone) {
        const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        return phoneRegex.test(phone);
    }

    function validatePassword(password) {
        // Minimum 8 characters, at least 1 digit
        return password.length >= 8 && /\d/.test(password);
    }

    function validateConfirmPassword(password, confirmPassword) {
        return password === confirmPassword && confirmPassword.length > 0;
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
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const agreementCheckbox = document.getElementById('agreement');

    firstNameInput.addEventListener('blur', function() {
        if (this.value && !validateName(this.value)) {
            showError('firstName', 'firstNameError', 'Имя должно содержать минимум 2 символа и только буквы');
        } else {
            clearError('firstName', 'firstNameError');
        }
    });

    lastNameInput.addEventListener('blur', function() {
        if (this.value && !validateName(this.value)) {
            showError('lastName', 'lastNameError', 'Фамилия должна содержать минимум 2 символа и только буквы');
        } else {
            clearError('lastName', 'lastNameError');
        }
    });

    emailInput.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            showError('email', 'emailError', 'Введите корректный email адрес');
        } else {
            clearError('email', 'emailError');
        }
    });

    phoneInput.addEventListener('blur', function() {
        if (this.value && !validatePhone(this.value)) {
            showError('phone', 'phoneError', 'Введите корректный номер телефона');
        } else {
            clearError('phone', 'phoneError');
        }
    });

    passwordInput.addEventListener('blur', function() {
        if (this.value && !validatePassword(this.value)) {
            showError('password', 'passwordError', 'Пароль должен содержать минимум 8 символов и 1 цифру');
        } else {
            clearError('password', 'passwordError');
        }
    });

    confirmPasswordInput.addEventListener('blur', function() {
        if (this.value && !validateConfirmPassword(passwordInput.value, this.value)) {
            showError('confirmPassword', 'confirmPasswordError', 'Пароли не совпадают');
        } else {
            clearError('confirmPassword', 'confirmPasswordError');
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

        if (!validateName(firstNameInput.value)) {
            showError('firstName', 'firstNameError', 'Имя обязательно для заполнения');
            isValid = false;
        }

        if (!validateName(lastNameInput.value)) {
            showError('lastName', 'lastNameError', 'Фамилия обязательна для заполнения');
            isValid = false;
        }

        if (!validateEmail(emailInput.value)) {
            showError('email', 'emailError', 'Введите корректный email адрес');
            isValid = false;
        }

        if (!validatePhone(phoneInput.value)) {
            showError('phone', 'phoneError', 'Введите корректный номер телефона');
            isValid = false;
        }

        if (!validatePassword(passwordInput.value)) {
            showError('password', 'passwordError', 'Пароль должен содержать минимум 8 символов и 1 цифру');
            isValid = false;
        }

        if (!validateConfirmPassword(passwordInput.value, confirmPasswordInput.value)) {
            showError('confirmPassword', 'confirmPasswordError', 'Пароли не совпадают');
            isValid = false;
        }

        if (!agreementCheckbox.checked) {
            isValid = false;
            // Scroll to checkbox
            agreementCheckbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            agreementCheckbox.focus();
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
            const response = await fetch(`${window.API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: firstNameInput.value.trim(),
                    lastName: lastNameInput.value.trim(),
                    email: emailInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    password: passwordInput.value
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
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
            submitBtn.textContent = 'Зарегистрироваться';

            // Show error - check if it's an email conflict
            if (error.message.includes('already') || error.message.includes('Email')) {
                showError('email', 'emailError', 'Этот email уже зарегистрирован');
            } else {
                showError('email', 'emailError', error.message || 'Ошибка регистрации. Попробуйте еще раз.');
            }
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



