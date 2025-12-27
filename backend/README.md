# Backend для ФОК "Олимп"

## Установка

1. Установите зависимости:
```bash
cd backend
npm install
```

2. Создайте файл `.env` в директории `backend` на основе `.env.example`:
```bash
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**ВАЖНО:** Замените `JWT_SECRET` на безопасный случайный ключ в production!

3. Инициализируйте базу данных:
```bash
npm run init-db
```

Это создаст файл `database.sqlite` и заполнит таблицу services данными.

## Запуск

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

Сервер будет доступен на `http://localhost:3000`

## API Endpoints

### Auth
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Получить текущего пользователя (требует авторизации)

### Profile
- `PATCH /api/profile` - Обновить профиль (email, phone) (требует авторизации)

### Services
- `GET /api/services` - Получить все услуги
- `GET /api/services/:id` - Получить услугу по ID

### Bookings
- `POST /api/bookings` - Создать бронирование (требует авторизации)
- `GET /api/bookings/me` - Получить мои бронирования (требует авторизации)
- `DELETE /api/bookings/:id` - Удалить бронирование (требует авторизации)

### Contacts
- `POST /api/contacts` - Отправить сообщение через форму контактов

## Структура ответов API

Все ответы следуют единому формату:

**Успешный ответ:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Ошибка:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## База данных

Используется SQLite. Файл базы данных: `database.sqlite` в корне директории `backend`.

### Таблицы:
- `users` - пользователи
- `services` - услуги
- `bookings` - бронирования
- `contacts` - сообщения из формы контактов

## Frontend

Frontend находится в директории `/frontend` и автоматически обслуживается Express как статические файлы.
