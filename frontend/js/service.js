// Service detail page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load service data based on URL parameter
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    function loadServiceData() {
        const serviceId = getUrlParameter('id');
        
        if (!serviceId) {
            showServiceNotFound();
            return;
        }

        const service = servicesData[serviceId];
        
        if (!service) {
            showServiceNotFound();
            return;
        }

        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = `ФОК "Олимп" - ${service.title}`;
        }

        // Update service image
        const serviceImage = document.getElementById('serviceImage');
        if (serviceImage) {
            serviceImage.src = `assets/images/${service.galleryImage}`;
            serviceImage.alt = service.title;
        }

        // Update service title
        const serviceTitle = document.getElementById('serviceTitle');
        if (serviceTitle) {
            serviceTitle.textContent = service.title;
        }

        // Update prices
        const servicePrice = document.getElementById('servicePrice');
        if (servicePrice) {
            servicePrice.textContent = service.price;
        }

        const servicePriceHeader = document.getElementById('servicePriceHeader');
        if (servicePriceHeader) {
            servicePriceHeader.textContent = service.price;
        }

        // Update description
        const serviceDescription = document.getElementById('serviceDescription');
        if (serviceDescription) {
            serviceDescription.textContent = service.description;
        }

        // Update details
        const serviceDuration = document.getElementById('serviceDuration');
        if (serviceDuration) {
            serviceDuration.textContent = service.duration;
        }

        const serviceFormat = document.getElementById('serviceFormat');
        if (serviceFormat) {
            serviceFormat.textContent = service.format;
        }

        const serviceAge = document.getElementById('serviceAge');
        if (serviceAge) {
            serviceAge.textContent = service.age;
        }

        const serviceLevel = document.getElementById('serviceLevel');
        if (serviceLevel) {
            serviceLevel.textContent = service.level;
        }
    }

    function showServiceNotFound() {
        // Hide main content
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.style.display = 'none';
        }

        // Show not found message
        const notFound = document.getElementById('serviceNotFound');
        if (notFound) {
            notFound.style.display = 'block';
        }
    }

    // Load service data on page load
    loadServiceData();

    const bookingForm = document.getElementById('bookingForm');
    const bookingDateInput = document.getElementById('bookingDate');
    const bookingTimeInput = document.getElementById('bookingTime');
    const bookingSubmitBtn = document.getElementById('bookingSubmitBtn');
    const datePickerIcon = document.querySelector('.date-picker-icon');

    // Date input formatting (dd.mm.yy)
    if (bookingDateInput) {
        bookingDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            let formattedValue = '';

            if (value.length > 0) {
                formattedValue = value.substring(0, 2);
            }
            if (value.length >= 3) {
                formattedValue += '.' + value.substring(2, 4);
            }
            if (value.length >= 5) {
                formattedValue += '.' + value.substring(4, 6);
            }

            e.target.value = formattedValue;
        });

        // Date picker icon click handler
        if (datePickerIcon) {
            datePickerIcon.addEventListener('click', function() {
                bookingDateInput.focus();
                // In a real implementation, you would open a date picker here
                // For now, just focus the input
            });
        }
    }

    // Time input formatting (HH:MM)
    if (bookingTimeInput) {
        bookingTimeInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            let formattedValue = '';

            if (value.length > 0) {
                formattedValue = value.substring(0, 2);
            }
            if (value.length >= 3) {
                formattedValue += ':' + value.substring(2, 4);
            }

            // Limit to valid hours (00-23) and minutes (00-59)
            if (formattedValue.length >= 2) {
                const hours = parseInt(formattedValue.substring(0, 2));
                if (hours > 23) {
                    formattedValue = '23' + (formattedValue.length > 2 ? formattedValue.substring(2) : '');
                }
            }
            if (formattedValue.length >= 5) {
                const minutes = parseInt(formattedValue.substring(3, 5));
                if (minutes > 59) {
                    formattedValue = formattedValue.substring(0, 3) + '59';
                }
            }

            e.target.value = formattedValue;
        });
    }

    // Form validation
    function validateDate(date) {
        const dateRegex = /^(\d{2})\.(\d{2})\.(\d{2})$/;
        const match = date.match(dateRegex);
        if (!match) return false;

        const day = parseInt(match[1]);
        const month = parseInt(match[2]);
        const year = parseInt(match[3]);

        // Basic validation (day 1-31, month 1-12)
        return day >= 1 && day <= 31 && month >= 1 && month <= 12;
    }

    function validateTime(time) {
        const timeRegex = /^(\d{2}):(\d{2})$/;
        const match = time.match(timeRegex);
        if (!match) return false;

        const hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);

        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
    }

    // Form submission - open payment modal
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Clear previous errors
            const allInputs = bookingForm.querySelectorAll('.form-input');
            allInputs.forEach(input => {
                input.classList.remove('error');
            });

            // Validate fields
            let isValid = true;

            if (!validateDate(bookingDateInput.value)) {
                bookingDateInput.classList.add('error');
                isValid = false;
            }

            if (!validateTime(bookingTimeInput.value)) {
                bookingTimeInput.classList.add('error');
                isValid = false;
            }

            if (!isValid) {
                // Focus first error field
                const firstError = bookingForm.querySelector('.form-input.error');
                if (firstError) {
                    firstError.focus();
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            // Open payment modal with booking data
            openPaymentModal({
                date: bookingDateInput.value,
                time: bookingTimeInput.value
            });
        });
    }

    // Clear errors on input
    const inputs = bookingForm?.querySelectorAll('.form-input');
    inputs?.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
        });
    });

    // Payment Modal functionality
    const paymentModal = document.getElementById('paymentModal');
    const paymentModalBackdrop = document.getElementById('paymentModalBackdrop');
    const paymentModalClose = document.getElementById('paymentModalClose');
    const paymentCancelBtn = document.getElementById('paymentCancelBtn');
    const paymentForm = document.getElementById('paymentForm');
    const paymentSubmitBtn = document.getElementById('paymentSubmitBtn');
    const successToast = document.getElementById('successToast');

    // Open payment modal
    function openPaymentModal(bookingData) {
        if (!paymentModal) return;

        // Update modal with booking data
        const serviceName = document.querySelector('.service-title')?.textContent || 'Тренажёрный зал';
        const servicePrice = document.querySelector('.service-price')?.textContent || 'от 100 рублей';
        
        document.getElementById('paymentServiceName').textContent = serviceName;
        document.getElementById('paymentServicePrice').textContent = servicePrice;
        document.getElementById('paymentServiceDate').textContent = bookingData.date || 'Не выбрано';
        document.getElementById('paymentServiceTime').textContent = bookingData.time || 'Не выбрано';
        document.getElementById('paymentTotalAmount').textContent = servicePrice.replace('от ', '');

        // Show modal
        paymentModal.classList.add('active');
        paymentModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        // Focus first input
        const firstInput = paymentForm?.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    // Close payment modal
    function closePaymentModal() {
        if (!paymentModal) return;

        paymentModal.classList.remove('active');
        paymentModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');

        // Reset form
        if (paymentForm) {
            paymentForm.reset();
            // Clear errors
            const errorElements = paymentForm.querySelectorAll('.payment-form-error');
            errorElements.forEach(el => el.textContent = '');
            const errorInputs = paymentForm.querySelectorAll('.payment-form-input.error');
            errorInputs.forEach(input => input.classList.remove('error'));
        }
    }

    // Close modal handlers
    if (paymentModalClose) {
        paymentModalClose.addEventListener('click', closePaymentModal);
    }

    if (paymentModalBackdrop) {
        paymentModalBackdrop.addEventListener('click', closePaymentModal);
    }

    if (paymentCancelBtn) {
        paymentCancelBtn.addEventListener('click', closePaymentModal);
    }

    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && paymentModal?.classList.contains('active')) {
            closePaymentModal();
        }
    });

    // Card number formatting
    const cardNumberInput = document.getElementById('paymentCardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            if (formattedValue.length > 19) {
                formattedValue = formattedValue.substring(0, 19);
            }
            e.target.value = formattedValue;
            e.target.classList.remove('error');
            document.getElementById('cardNumberError').textContent = '';
        });
    }

    // Card expiry formatting (MM/YY)
    const cardExpiryInput = document.getElementById('paymentCardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = value;
            if (value.length >= 2) {
                formattedValue = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = formattedValue;
            e.target.classList.remove('error');
            document.getElementById('cardExpiryError').textContent = '';
        });
    }

    // CVV formatting (numbers only)
    const cardCVVInput = document.getElementById('paymentCardCVV');
    if (cardCVVInput) {
        cardCVVInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
            e.target.classList.remove('error');
            document.getElementById('cardCVVError').textContent = '';
        });
    }

    // Cardholder name formatting (uppercase, letters and spaces only)
    const cardholderInput = document.getElementById('paymentCardholder');
    if (cardholderInput) {
        cardholderInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^A-ZА-Я\s]/gi, '').toUpperCase();
            e.target.classList.remove('error');
            document.getElementById('cardholderError').textContent = '';
        });
    }

    // Payment form validation
    function validatePaymentForm() {
        let isValid = true;

        // Card number validation (16 digits)
        const cardNumber = cardNumberInput?.value.replace(/\s/g, '');
        if (!cardNumber || cardNumber.length !== 16) {
            cardNumberInput?.classList.add('error');
            document.getElementById('cardNumberError').textContent = 'Введите 16 цифр номера карты';
            isValid = false;
        }

        // Expiry validation (MM/YY format)
        const expiry = cardExpiryInput?.value;
        const expiryRegex = /^(\d{2})\/(\d{2})$/;
        if (!expiry || !expiryRegex.test(expiry)) {
            cardExpiryInput?.classList.add('error');
            document.getElementById('cardExpiryError').textContent = 'Введите срок действия (ММ/ГГ)';
            isValid = false;
        } else {
            const month = parseInt(expiry.substring(0, 2));
            if (month < 1 || month > 12) {
                cardExpiryInput?.classList.add('error');
                document.getElementById('cardExpiryError').textContent = 'Неверный месяц';
                isValid = false;
            }
        }

        // CVV validation (3 digits)
        const cvv = cardCVVInput?.value;
        if (!cvv || cvv.length !== 3) {
            cardCVVInput?.classList.add('error');
            document.getElementById('cardCVVError').textContent = 'Введите 3 цифры CVV';
            isValid = false;
        }

        // Cardholder validation
        const cardholder = cardholderInput?.value.trim();
        if (!cardholder || cardholder.length < 2) {
            cardholderInput?.classList.add('error');
            document.getElementById('cardholderError').textContent = 'Введите имя держателя карты';
            isValid = false;
        }

        return isValid;
    }

    // Payment form submission
    if (paymentForm) {
        paymentForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (!validatePaymentForm()) {
                // Focus first error field
                const firstError = paymentForm.querySelector('.payment-form-input.error');
                if (firstError) {
                    firstError.focus();
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            // Show loading state
            paymentSubmitBtn.disabled = true;
            paymentSubmitBtn.classList.add('loading');
            const originalText = paymentSubmitBtn.textContent;
            paymentSubmitBtn.textContent = 'Обработка...';

            // Process payment and create booking
            const bookingDate = document.getElementById('paymentServiceDate').textContent;
            const bookingTime = document.getElementById('paymentServiceTime').textContent;
            const serviceName = document.getElementById('paymentServiceName').textContent;
            const amount = document.getElementById('paymentTotalAmount').textContent;
            
            // Get service ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const serviceId = urlParams.get('id');

            // Get token
            const token = localStorage.getItem('token');
            if (!token) {
                // If not logged in, redirect to login
                alert('Необходимо войти в систему для бронирования');
                window.location.href = './login.html';
                return;
            }

            try {
                // Create booking via API
                const bookingResponse = await fetch('http://localhost:3000/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        serviceId: serviceId,
                        serviceTitle: serviceName,
                        date: bookingDate,
                        time: bookingTime
                    })
                });

                const bookingData = await bookingResponse.json();

                if (!bookingResponse.ok) {
                    throw new Error(bookingData.error || 'Failed to create booking');
                }

                // Update booking status to 'paid' (in a real app, this would be done after actual payment processing)
                // For now, we'll leave it as 'pending' and let the user know booking was created

                // Add notifications (APPEND to array) - still using localStorage for notifications
                const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
                const now = Date.now();
                
                // Booking notification
                const bookingNotification = {
                    id: now.toString(),
                    type: 'booking',
                    title: 'Новое бронирование',
                    message: 'Бронирование успешно создано.',
                    createdAt: new Date().toISOString(),
                    isNew: true
                };
                
                // Payment notification
                const paymentNotification = {
                    id: (now + 1).toString(),
                    type: 'payment',
                    title: 'Оплата прошла',
                    message: 'Платёж подтверждён.',
                    createdAt: new Date().toISOString(),
                    isNew: true
                };
                
                notifications.unshift(paymentNotification); // Add payment first
                notifications.unshift(bookingNotification); // Add booking first
                localStorage.setItem('notifications', JSON.stringify(notifications));

                // Remove loading state
                paymentSubmitBtn.disabled = false;
                paymentSubmitBtn.classList.remove('loading');
                paymentSubmitBtn.textContent = originalText;

                // Close modal
                closePaymentModal();

                // Show success toast
                showToast('Оплата успешно выполнена!');
            } catch (error) {
                console.error('Failed to create booking:', error);
                
                // Remove loading state
                paymentSubmitBtn.disabled = false;
                paymentSubmitBtn.classList.remove('loading');
                paymentSubmitBtn.textContent = originalText;
                
                alert('Ошибка при создании бронирования: ' + (error.message || 'Неизвестная ошибка'));
            }
        });
    }

    // Toast notification
    function showToast(message) {
        if (!successToast) return;

        const toastMessage = successToast.querySelector('.toast-message');
        if (toastMessage) {
            toastMessage.textContent = message;
        }

        successToast.classList.add('show');

        setTimeout(function() {
            successToast.classList.remove('show');
        }, 3000);
    }
});

