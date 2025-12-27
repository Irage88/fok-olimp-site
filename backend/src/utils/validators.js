// Input validation utilities
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    // Accepts +7 (XXX) XXX-XX-XX format
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    return phoneRegex.test(phone);
}

function validatePassword(password) {
    // Minimum 8 characters, at least 1 digit
    return password.length >= 8 && /\d/.test(password);
}

function validateDate(date) {
    // DD.MM.YY format (as used in frontend)
    const dateRegex = /^(\d{2})\.(\d{2})\.(\d{2})$/;
    return dateRegex.test(date);
}

function validateTime(time) {
    // HH:MM format
    const timeRegex = /^(\d{2}):(\d{2})$/;
    return timeRegex.test(time);
}

module.exports = {
    validateEmail,
    validatePhone,
    validatePassword,
    validateDate,
    validateTime
};
