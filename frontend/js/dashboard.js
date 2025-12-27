// Dashboard / Личный кабинет JavaScript

console.log("dashboard.js loaded");

let currentUser = null;

document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication first
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = './login.html';
        return;
    }

    // DOM elements
    const activeBookingsCountEl = document.getElementById('activeBookingsCount');
    const paymentsCountEl = document.getElementById('paymentsCount');
    const newNotificationsCountEl = document.getElementById('newNotificationsCount');
    const notificationsListEl = document.getElementById('notificationsList');
    const bookingsContentEl = document.getElementById('bookingsContent');
    const paymentHistoryContentEl = document.getElementById('paymentHistoryContent');
    const markAllNotificationsBtn = document.getElementById('markAllNotificationsBtn');
    const settingsForm = document.getElementById('settingsForm');

    // Load user data
    try {
        await loadUserData();
    } catch (error) {
        console.error('Failed to load user data:', error);
        // If token is invalid, redirect to login
        if (error.message.includes('401') || error.message.includes('token')) {
            localStorage.removeItem('token');
            window.location.href = './login.html';
            return;
        }
    }

    // Load user data from backend
    async function loadUserData() {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token');
        }

        const response = await fetch('http://localhost:3000/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load user data');
        }

        if (data.success && data.data) {
            currentUser = data.data;
            updateUserName();
            loadSettings();
        }
    }

    // Helper functions for per-user notifications
    function getNotificationsKey() {
        if (!currentUser) return 'notifications';
        return currentUser.id ? `notifications_${currentUser.id}` : `notifications_${currentUser.email}`;
    }

    function loadNotifications() {
        const key = getNotificationsKey();
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    function saveNotifications(notifications) {
        const key = getNotificationsKey();
        localStorage.setItem(key, JSON.stringify(notifications));
    }

    // Update user name display
    function updateUserName() {
        if (!currentUser) return;
        const userNameEl = document.querySelector('.dashboard-user-name');
        if (userNameEl) {
            userNameEl.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        }
    }

    // Load settings from user data
    function loadSettings() {
        if (currentUser) {
            if (currentUser.email) {
                document.getElementById('settingsEmail').value = currentUser.email;
            }
            if (currentUser.phone) {
                document.getElementById('settingsPhone').value = currentUser.phone;
            }
        }
        // Load notifications preference from localStorage (if exists)
        const notifications = JSON.parse(localStorage.getItem('userSettings') || '{}');
        if (notifications.notifications !== undefined) {
            document.getElementById('settingsNotifications').checked = notifications.notifications;
        }
    }

    // Save settings to backend
    async function saveSettings() {
        const email = document.getElementById('settingsEmail').value;
        const phone = document.getElementById('settingsPhone').value;
        const notifications = document.getElementById('settingsNotifications').checked;

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token');
        }

        try {
            const response = await fetch('http://localhost:3000/api/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email, phone })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }

            if (data.success && data.data) {
                currentUser = data.data;
                updateUserName();
                
                // Save notifications preference to localStorage (not in backend)
                localStorage.setItem('userSettings', JSON.stringify({ notifications }));
                
                return true;
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
            throw error;
        }
    }

    // Format date for display (dd.mm.yyyy)
    function formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        } catch (e) {
            // If dateString is already in dd.mm.yy format, return as is
            return dateString;
        }
    }

    // Calculate overview metrics
    async function updateOverview() {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            // Load bookings to count active ones
            const bookingsResponse = await fetch('http://localhost:3000/api/bookings/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const bookingsData = await bookingsResponse.json();
            const bookings = (bookingsData.success && bookingsData.data) ? bookingsData.data : [];
            
            // Count active bookings (status pending or paid)
            const activeBookings = bookings.filter(b => b.status === 'pending' || b.status === 'paid').length;
            activeBookingsCountEl.textContent = activeBookings;

            // Count paid bookings as payments
            const paidBookings = bookings.filter(b => b.status === 'paid').length;
            paymentsCountEl.textContent = paidBookings;

            // Notifications (per-user from localStorage)
            const notifications = loadNotifications();
            const newNotifications = notifications.filter(n => n.isNew === true).length;
            newNotificationsCountEl.textContent = newNotifications;
        } catch (error) {
            console.error('Failed to update overview:', error);
        }
    }

    // Render notifications
    function renderNotifications() {
        // Always clear before rendering
        notificationsListEl.innerHTML = '';
        
        const notifications = loadNotifications();
        
        // Debug log
        console.log("Notifications key:", getNotificationsKey(), notifications.length);
        
        if (notifications.length === 0) {
            notificationsListEl.innerHTML = '<p class="dashboard-empty-state">Нет уведомлений</p>';
            return;
        }

        notificationsListEl.innerHTML = notifications.map(notification => {
            const date = formatDate(notification.createdAt);
            const isNew = notification.isNew === true;
            
            return `
                <div class="dashboard-notification ${isNew ? 'dashboard-notification-new' : ''}" data-id="${notification.id}">
                    <div class="dashboard-notification-info">
                        <h3 class="dashboard-notification-title">${notification.title}</h3>
                        <p class="dashboard-notification-message">${notification.message}</p>
                        <p class="dashboard-notification-date">${date}</p>
                    </div>
                    ${isNew ? '<div class="dashboard-notification-badge">новое</div>' : ''}
                    ${isNew ? '<button class="dashboard-notification-mark-read" aria-label="Отметить как прочитанное">×</button>' : ''}
                </div>
            `;
        }).join('');

        // Add event listeners for mark as read buttons
        const markReadButtons = notificationsListEl.querySelectorAll('.dashboard-notification-mark-read');
        markReadButtons.forEach(button => {
            button.addEventListener('click', function() {
                const notificationId = this.closest('.dashboard-notification').dataset.id;
                markNotificationAsRead(notificationId);
            });
        });
    }

    // Mark notification as read
    function markNotificationAsRead(notificationId) {
        const notifications = loadNotifications();
        const notification = notifications.find(n => n.id === notificationId);
        
        if (notification) {
            notification.isNew = false;
            saveNotifications(notifications);
            renderNotifications();
            updateOverview();
        }
    }

    // Mark all notifications as read
    function markAllNotificationsAsRead() {
        const notifications = loadNotifications();
        notifications.forEach(notification => {
            notification.isNew = false;
        });
        saveNotifications(notifications);
        renderNotifications();
        updateOverview();
    }

    // Load bookings from backend
    async function loadBookings() {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:3000/api/bookings/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok && data.success && data.data) {
                renderBookings(data.data);
            } else {
                throw new Error(data.error || 'Failed to load bookings');
            }
        } catch (error) {
            console.error('Failed to load bookings:', error);
            bookingsContentEl.innerHTML = '<p class="dashboard-empty-state">Ошибка загрузки бронирований</p>';
        }
    }

    // Render bookings from backend
    function renderBookings(bookings) {
        if (!bookings || bookings.length === 0) {
            bookingsContentEl.innerHTML = '<p class="dashboard-empty-state">Нет активных бронирований</p>';
            return;
        }

        bookingsContentEl.innerHTML = bookings.map(booking => {
            const dateTime = `${booking.date}${booking.time ? ' ' + booking.time : ''}`;
            const status = booking.status === 'paid' ? 'подтверждено' : booking.status === 'pending' ? 'ожидает оплаты' : booking.status;
            const statusClass = booking.status === 'paid' ? 'dashboard-badge-success' : 'dashboard-badge-pending';

            return `
                <div class="dashboard-booking-row" data-booking-id="${booking.id}">
                    <div class="dashboard-booking-col">
                        <p class="dashboard-booking-label">Услуга</p>
                        <p class="dashboard-booking-value">${booking.serviceTitle || 'Не указано'}</p>
                    </div>
                    <div class="dashboard-booking-col">
                        <p class="dashboard-booking-label">Дата/Время</p>
                        <p class="dashboard-booking-value">${dateTime}</p>
                    </div>
                    <div class="dashboard-booking-col">
                        <p class="dashboard-booking-label">Статус</p>
                        <div class="dashboard-badge ${statusClass}">${status}</div>
                    </div>
                    <div class="dashboard-booking-col dashboard-booking-actions">
                        <button class="btn btn-outline-teal btn-cancel-booking" data-booking-id="${booking.id}">Отменить</button>
                    </div>
                </div>
            `;
        }).join('');

        // Add cancel booking handlers
        const cancelButtons = bookingsContentEl.querySelectorAll('.btn-cancel-booking');
        cancelButtons.forEach(button => {
            button.addEventListener('click', async function() {
                const bookingId = this.dataset.bookingId;
                if (confirm('Вы уверены, что хотите отменить бронирование?')) {
                    await deleteBooking(bookingId);
                }
            });
        });
    }

    // Delete booking
    async function deleteBooking(bookingId) {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:3000/api/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                await loadBookings();
                updateOverview();
            } else {
                throw new Error(data.error || 'Failed to delete booking');
            }
        } catch (error) {
            console.error('Failed to delete booking:', error);
            alert('Ошибка при отмене бронирования');
        }
    }

    // Render payment history
    function renderPaymentHistory() {
        const paymentHistory = JSON.parse(localStorage.getItem('paymentHistory') || 'null');
        
        if (!paymentHistory) {
            paymentHistoryContentEl.innerHTML = '<p class="dashboard-empty-state">Нет истории оплат</p>';
            return;
        }

        const date = formatDate(paymentHistory.date || paymentHistory.timestamp);
        const status = paymentHistory.status === 'paid' ? 'успешно' : 'ошибка';
        const statusClass = paymentHistory.status === 'paid' ? 'dashboard-badge-success' : 'dashboard-badge-error';

        paymentHistoryContentEl.innerHTML = `
            <div class="dashboard-payment-row">
                <div class="dashboard-payment-col">
                    <p class="dashboard-payment-label">Дата</p>
                    <p class="dashboard-payment-value">${date}</p>
                </div>
                <div class="dashboard-payment-col">
                    <p class="dashboard-payment-label">Услуга</p>
                    <p class="dashboard-payment-value">${paymentHistory.serviceName || 'Не указано'}</p>
                </div>
                <div class="dashboard-payment-col">
                    <p class="dashboard-payment-label">Сумма</p>
                    <p class="dashboard-payment-value">${paymentHistory.amount || 'Не указано'}</p>
                </div>
                <div class="dashboard-payment-col">
                    <p class="dashboard-payment-label">Статус</p>
                    <div class="dashboard-badge ${statusClass}">${status}</div>
                </div>
            </div>
        `;
    }

    // Refresh all dashboard data
    async function refreshDashboard() {
        await updateOverview();
        renderNotifications();
        await loadBookings();
        renderPaymentHistory();
    }

    // Event listeners
    if (markAllNotificationsBtn) {
        markAllNotificationsBtn.addEventListener('click', markAllNotificationsAsRead);
    }

    if (settingsForm) {
        settingsForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            try {
                const submitBtn = settingsForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Сохранение...';
                
                await saveSettings();
                alert('Настройки сохранены');
                
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            } catch (error) {
                alert(error.message || 'Ошибка сохранения настроек');
                const submitBtn = settingsForm.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Сохранить';
            }
        });
    }

    // Initial load
    await refreshDashboard();

    // Listen for storage changes (for cross-tab updates)
    window.addEventListener('storage', function(e) {
        if (e.key === 'currentBooking' || e.key === 'paymentHistory') {
            refreshDashboard();
        } else if (e.key && e.key.startsWith('notifications_')) {
            // Check if this is the current user's notifications key
            if (e.key === getNotificationsKey()) {
                refreshDashboard();
            }
        }
    });

    // Expose refresh function globally for manual refresh if needed
    window.refreshDashboard = refreshDashboard;
});

