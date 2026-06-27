# Руководство администратора

> **ScienceJournal — Платформа публикации научных статей**  
> Версия 1.0 | Группа ПИЖ-б-о-24-1 | СКФУ, 2026

---

## Введение

Данное руководство предназначено для системного администратора, ответственного за установку, настройку и эксплуатацию платформы ScienceJournal.

---

## 1. Системные требования

### 1.1. Серверная часть (Backend)

| Компонент | Требование |
|---|---|
| ОС | Linux (Ubuntu 22.04+) / macOS / Windows 10+ |
| Node.js | 18.x или выше |
| npm | 9.x или выше |
| MongoDB | 6.x или выше (локально или Atlas) |
| Свободное место | не менее 500 МБ (без учёта медиафайлов) |
| Порт | 3000 (backend), 5173 (frontend dev) |

### 1.2. Клиентская часть (Frontend)

| Компонент | Требование |
|---|---|
| Браузер | Chrome 90+ / Firefox 88+ / Safari 14+ |
| Node.js | 18.x (для сборки) |

---

## 2. Установка и развёртывание

### 2.1. Клонирование репозитория

```bash
git clone <repository-url>
cd sophia-course
```

### 2.2. Настройка Backend

```bash
cd server

# 1. Установить зависимости
npm install

# 2. Создать .env файл
cp .env.example .env
```

**Содержимое `.env`:**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sciencejournal
JWT_SECRET=your-very-secret-key-here
JWT_EXPIRES_IN=24h
```

| Переменная | Описание | Пример |
|---|---|---|
| PORT | Порт HTTP-сервера | 3000 |
| MONGODB_URI | Строка подключения MongoDB | mongodb://localhost:27017/sciencejournal |
| JWT_SECRET | Секретный ключ JWT (минимум 32 символа) | random_secret_string |
| JWT_EXPIRES_IN | Срок действия токена | 24h / 7d |

### 2.3. Запуск Backend

```bash
# Режим разработки (nodemon)
npm run dev

# Производственный режим
npm start
```

Сервер запустится на `http://localhost:3000`.

### 2.4. Настройка Frontend

```bash
cd ../client

# 1. Установить зависимости
npm install

# 2. Создать .env файл (если требуется)
echo "VITE_API_URL=http://localhost:3000/api" > .env
```

### 2.5. Запуск Frontend (разработка)

```bash
npm run dev
```

Приложение доступно на `http://localhost:5173`.

### 2.6. Сборка Frontend для production

```bash
npm run build
# Результат в папке dist/
```

Статические файлы из `dist/` размещаются на любом веб-сервере (Nginx, Apache).

---

## 3. Структура файлового хранилища

Медиафайлы публикаций хранятся в:
```
server/
└── file_storage/
    └── posts/
        ├── <postId>_image.jpg     # Обложки статей
        ├── <postId>_article.pdf   # PDF-файлы статей
        └── ...
```

**Доступ к файлам:** `GET http://localhost:3000/file_storage/posts/<filename>`

> **Внимание:** директория `file_storage/` создаётся автоматически при первом запуске сервера.

**Резервное копирование:**
```bash
# Создание архива медиафайлов
tar -czf backup_files_$(date +%Y%m%d).tar.gz server/file_storage/
```

---

## 4. База данных

### 4.1. Подключение к MongoDB

```bash
# Локальная MongoDB
mongosh mongodb://localhost:27017/sciencejournal

# MongoDB Atlas
mongosh "mongodb+srv://cluster.mongodb.net/sciencejournal" --username admin
```

### 4.2. Управление коллекциями

```javascript
// Просмотр всех пользователей
db.users.find({}).pretty()

// Просмотр публикаций
db.posts.find({}).sort({ publishDate: -1 }).pretty()

// Удаление публикации (при необходимости модерации)
db.posts.deleteOne({ _id: ObjectId("...") })

// Изменение роли пользователя
db.users.updateOne(
  { login: "username" },
  { $set: { role: "p" } }
)
```

### 4.3. Индексы

```javascript
// Проверка индексов коллекции users
db.users.getIndexes()

// Проверка индексов коллекции posts
db.posts.getIndexes()

// Пересоздание индекса (при необходимости)
db.users.dropIndex("login_1")
db.users.createIndex({ login: 1 }, { unique: true })
```

---

## 5. Мониторинг и логирование

### 5.1. Логи сервера

В режиме разработки (nodemon) логи выводятся в консоль:
```
👂 Прослушивание на: http://127.0.0.1:3000
✅ MongoDB подключена
📂 Файловое хранилище найдено
```

### 5.2. Типичные ошибки и их решение

| Ошибка | Причина | Решение |
|---|---|---|
| `MongoServerError: connect ECONNREFUSED` | MongoDB не запущена | `sudo service mongod start` |
| `Error: JWT_SECRET is not defined` | Не настроен `.env` | Добавить `JWT_SECRET` в `.env` |
| `CORS policy blocked` | Неверный origin в CORS | Обновить `origin` в `server/index.js` |
| `EADDRINUSE: port 3000` | Порт занят | `kill -9 $(lsof -t -i:3000)` |
| `Multer: unexpected field` | Неверные имена полей файлов | Поля должны называться `image` и `pdf` |

---

## 6. Безопасность

### 6.1. Чек-лист безопасности production

- [ ] Изменить `JWT_SECRET` на случайную строку ≥ 32 символов
- [ ] Обновить `origin` в CORS с `localhost:5173` на реальный домен
- [ ] Настроить HTTPS (SSL/TLS-сертификат)
- [ ] Ограничить доступ к MongoDB (authentication enabled)
- [ ] Добавить rate limiting для API (`express-rate-limit`)
- [ ] Проверять MIME-тип загружаемых файлов в Multer
- [ ] Регулярное резервное копирование MongoDB и `file_storage/`

### 6.2. Смена JWT_SECRET

При компрометации секрета:
1. Обновите `JWT_SECRET` в `.env`
2. Перезапустите сервер
3. Все активные сессии станут недействительными — пользователи должны войти повторно

---

## 7. Обновление системы

```bash
# 1. Получить последние изменения
git pull origin main

# 2. Обновить зависимости backend
cd server && npm install

# 3. Обновить зависимости frontend
cd ../client && npm install

# 4. Пересобрать frontend (для production)
npm run build

# 5. Перезапустить сервер
pm2 restart sciencejournal  # или systemctl restart
```

---

## 8. Контакты и поддержка

По вопросам эксплуатации системы обращаться к разработчику:
- Группа: ПИЖ-б-о-24-1
- Руководитель: Самойлов Ф.В., СКФУ
