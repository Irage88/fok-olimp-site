
document.addEventListener('DOMContentLoaded', function() {
    initYandexMap();

    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        setupFeedbackForm(feedbackForm);
    }

    const consentCheckbox = document.getElementById('feedbackConsent');
    const customConsentCheckbox = consentCheckbox?.parentElement.querySelector('.checkbox-custom');
    if (consentCheckbox && customConsentCheckbox) {
        setupCustomCheckbox(consentCheckbox, customConsentCheckbox);
    }
});

function initYandexMap() {
    if (typeof ymaps === 'undefined') {
        console.warn('Yandex Maps API not loaded. Using fallback.');
        const mapContainer = document.getElementById('yandex-map');
        if (mapContainer) {
            mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f0f0f0; color: #666;">Карта загружается...</div>';
        }
        return;
    }

    ymaps.ready(function() {
        const mapContainer = document.getElementById('yandex-map');
        if (!mapContainer) return;

        // Fallback coordinates
        const fallbackCoordinates = [61.3706, 63.5676];
        const address = "г. Советский, ул. Юности, 12";

        // Use geocoding to get accurate coordinates
        ymaps.geocode(address).then(function(res) {
            let coordinates = fallbackCoordinates;
            
            const geoObjects = res.geoObjects;
            if (geoObjects.getLength() > 0) {
                coordinates = geoObjects.get(0).geometry.getCoordinates();
            }
            
            // Debug log
            console.log("Map coordinates used:", coordinates);

            const map = new ymaps.Map('yandex-map', {
                center: coordinates,
                zoom: 16,
                controls: ['zoomControl', 'fullscreenControl']
            });

            const placemark = new ymaps.Placemark(
                coordinates,
                {
                    balloonContent: 'ФОК "Олимп"<br>г. Советский, ул. Юности, 12',
                    iconCaption: 'ФОК "Олимп"'
                },
                {
                    preset: 'islands#redDotIcon',
                    iconColor: '#35a296'
                }
            );

            map.geoObjects.add(placemark);

            placemark.events.add('click', function() {
                placemark.balloon.open();
            });

            map.events.add('error', function(e) {
                console.error('Yandex Map error:', e);
                mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f0f0f0; color: #666; padding: 20px; text-align: center;">Ошибка загрузки карты. <a href="https://yandex.ru/maps/-/CLD2UZ7a" target="_blank" style="color: #35a296;">Открыть в Яндекс.Картах</a></div>';
            });
        }).catch(function(error) {
            console.warn('Geocoding failed, using fallback coordinates:', error);
            // Use fallback coordinates if geocoding fails
            const coordinates = fallbackCoordinates;
            
            // Debug log
            console.log("Map coordinates used:", coordinates);

            const map = new ymaps.Map('yandex-map', {
                center: coordinates,
                zoom: 16,
                controls: ['zoomControl', 'fullscreenControl']
            });

            const placemark = new ymaps.Placemark(
                coordinates,
                {
                    balloonContent: 'ФОК "Олимп"<br>г. Советский, ул. Юности, 12',
                    iconCaption: 'ФОК "Олимп"'
                },
                {
                    preset: 'islands#redDotIcon',
                    iconColor: '#35a296'
                }
            );

            map.geoObjects.add(placemark);

            placemark.events.add('click', function() {
                placemark.balloon.open();
            });

            map.events.add('error', function(e) {
                console.error('Yandex Map error:', e);
                mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f0f0f0; color: #666; padding: 20px; text-align: center;">Ошибка загрузки карты. <a href="https://yandex.ru/maps/-/CLD2UZ7a" target="_blank" style="color: #35a296;">Открыть в Яндекс.Картах</a></div>';
            });
        });
    });
}

function setupFeedbackForm(form) {
    const nameInput = document.getElementById('feedbackName');
    const contactInput = document.getElementById('feedbackContact');
    const messageInput = document.getElementById('feedbackMessage');
    const consentCheckbox = document.getElementById('feedbackConsent');
    const submitBtn = document.getElementById('feedbackSubmitBtn');

    function validateName(name) {
        return name.trim().length >= 2;
    }

    function validateContact(contact) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return emailRegex.test(contact) || (phoneRegex.test(contact) && contact.replace(/\D/g, '').length >= 10);
    }

    function validateMessage(message) {
        return message.trim().length >= 10;
    }

    function showError(inputId, errorId, message) {
        const input = document.getElementById(inputId);
        const errorElement = document.getElementById(errorId);
        
        if (input) input.classList.add('error');
        if (errorElement) errorElement.textContent = message;
    }

    function clearError(inputId, errorId) {
        const input = document.getElementById(inputId);
        const errorElement = document.getElementById(errorId);
        
        if (input) input.classList.remove('error');
        if (errorElement) errorElement.textContent = '';
    }

    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            if (this.value && !validateName(this.value)) {
                showError('feedbackName', 'feedbackNameError', 'Имя должно содержать минимум 2 символа');
            } else {
                clearError('feedbackName', 'feedbackNameError');
            }
        });
    }

    if (contactInput) {
        contactInput.addEventListener('blur', function() {
            if (this.value && !validateContact(this.value)) {
                showError('feedbackContact', 'feedbackContactError', 'Введите корректный email или телефон');
            } else {
                clearError('feedbackContact', 'feedbackContactError');
            }
        });
    }

    if (messageInput) {
        messageInput.addEventListener('blur', function() {
            if (this.value && !validateMessage(this.value)) {
                showError('feedbackMessage', 'feedbackMessageError', 'Сообщение должно содержать минимум 10 символов');
            } else {
                clearError('feedbackMessage', 'feedbackMessageError');
            }
        });
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const allErrors = form.querySelectorAll('.form-error');
        allErrors.forEach(error => error.textContent = '');
        const allInputs = form.querySelectorAll('.form-input');
        allInputs.forEach(input => input.classList.remove('error'));

        let isValid = true;

        if (!validateName(nameInput.value)) {
            showError('feedbackName', 'feedbackNameError', 'Имя обязательно для заполнения');
            isValid = false;
        }

        if (!validateContact(contactInput.value)) {
            showError('feedbackContact', 'feedbackContactError', 'Введите корректный email или телефон');
            isValid = false;
        }

        if (!validateMessage(messageInput.value)) {
            showError('feedbackMessage', 'feedbackMessageError', 'Сообщение должно содержать минимум 10 символов');
            isValid = false;
        }

        if (!consentCheckbox.checked) {
            const customCheckbox = consentCheckbox.parentElement.querySelector('.checkbox-custom');
            if (customCheckbox) {
                customCheckbox.style.borderColor = 'red';
            }
            isValid = false;
        } else {
            const customCheckbox = consentCheckbox.parentElement.querySelector('.checkbox-custom');
            if (customCheckbox) {
                customCheckbox.style.borderColor = '';
            }
        }

        if (!isValid) {
            const firstError = form.querySelector('.form-input.error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';

        try {
            const response = await fetch('http://localhost:3000/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: nameInput.value.trim(),
                    contact: contactInput.value.trim(),
                    message: messageInput.value.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit contact');
            }

            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = originalText;

            alert('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.');
            
            form.reset();
            const customCheckbox = consentCheckbox.parentElement.querySelector('.checkbox-custom');
            if (customCheckbox) {
                customCheckbox.classList.remove('checked');
                customCheckbox.setAttribute('aria-checked', 'false');
            }
        } catch (error) {
            console.error('Failed to submit contact:', error);
            
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = originalText;
            
            alert('Ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.');
        }
    });

    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const errorId = this.id + 'Error';
            clearError(this.id, errorId);
        });
    });
}

function setupCustomCheckbox(checkboxInput, customCheckboxDiv) {
    if (!checkboxInput || !customCheckboxDiv) return;

    checkboxInput.addEventListener('change', function() {
        if (this.checked) {
            customCheckboxDiv.classList.add('checked');
            customCheckboxDiv.setAttribute('aria-checked', 'true');
        } else {
            customCheckboxDiv.classList.remove('checked');
            customCheckboxDiv.setAttribute('aria-checked', 'false');
        }
    });

    if (checkboxInput.checked) {
        customCheckboxDiv.classList.add('checked');
        customCheckboxDiv.setAttribute('aria-checked', 'true');
    }

    customCheckboxDiv.addEventListener('click', function(e) {
        e.preventDefault();
        checkboxInput.checked = !checkboxInput.checked;
        checkboxInput.dispatchEvent(new Event('change'));
    });
}

