# ScienceJournal — Платформа публикации научных статей

**Курсовой проект** по дисциплине «Технология разработки программного обеспечения»

СКФУ, Институт цифрового развития | Группа **ПИЖ-б-о-24-1** | 2026 г.  
Руководитель: Самойлов Ф.В., доцент МИБК  
Вариант 8 — Блог / публикации | **Траектория Б** (Full-stack SPA + REST API + JWT)

---

## Описание проекта

**ScienceJournal** — Full-Stack SPA-платформа для публикации и просмотра научных статей с поддержкой загрузки PDF-файлов, JWT-аутентификацией и ролевым разграничением доступа.

**Роли пользователей:**
- **Читатель (Reader)** — просматривает ленту и читает статьи
- **Публицист (Publisher)** — публикует статьи + все возможности читателя

**Скриншоты:**

![Лента публикаций](app1.png)

![Просмотр статьи](app2.png)

![Форма публикации](app3.png)

---

## Технологический стек

| Компонент | Технология |
|---|---|
| **Frontend** | React 18 + React Router DOM 6 + Vite 5 |
| **HTTP-клиент** | Axios (withCredentials, centralised instance) |
| **Backend** | Node.js 18 + Express 4 |
| **База данных** | MongoDB (Mongoose ODM) |
| **Аутентификация** | JWT + HTTP-only cookie (cookie-parser) |
| **Валидация** | Zod (server-side schema validation) |
| **Загрузка файлов** | Multer (multipart/form-data) |
| **Архитектура frontend** | Feature-Sliced Design (FSD-like) |
| **Линтинг** | ESLint + Prettier |
| **Модули** | ESM (type: module) |

---

## Архитектура

```
sophia-course/
├── client/              # React SPA (Vite)
│   └── src/
│       ├── pages/       # 6 страниц: Welcome, Auth, Register, Explore, Publish, Read
│       ├── components/  # Header, Modal, Post (карточка)
│       ├── features/    # Custom hooks: useAuth, useRegister, useExplore, usePost, useRead
│       ├── shared/      # UI Kit (Button, Input, TextArea, Checkbox) + Context + utils
│       └── api/         # Axios API layer
│
├── server/              # Node.js + Express REST API
│   └── src/
│       ├── routes/      # session/ (auth, register, status, logout) + posts/ (explore, read, publish)
│       ├── entities/    # Mongoose: User.js, Post.js
│       ├── services/    # UserService, PostService, mongoService
│       ├── middleware/  # verifySession (JWT guard)
│       └── validation/  # Zod schemas
│
└── docs/                # Проектная документация (12 разделов)
```

---

## REST API (8 эндпоинтов)

| Метод | Эндпоинт | Доступ | Описание |
|---|---|---|---|
| POST | `/api/session/register` | Публичный | Регистрация |
| POST | `/api/session/auth` | Публичный | Аутентификация (JWT) |
| POST | `/api/session/status` | Публичный | Проверка сессии |
| POST | `/api/session/logout` | Авторизованные | Выход |
| GET | `/api/posts/explore` | Авторизованные | Лента с пагинацией |
| GET | `/api/posts/read/:id` | Авторизованные | Детальный просмотр |
| POST | `/api/posts/publish` | Publisher | Создание публикации + файлы |
| GET | `/file_storage/posts/:file` | Все | Скачивание медиафайла |

Полная спецификация: [docs/07-api-spec/api-spec.md](docs/07-api-spec/api-spec.md)

---

## Быстрый старт

### Требования
- Node.js ≥ 18
- MongoDB (локально или Atlas URI)

### Backend

```bash
cd server
npm install
cp .env.example .env     # настроить MONGODB_URI и JWT_SECRET
npm run dev              # http://localhost:3000
```

### Frontend

```bash
cd client
npm install
npm run dev              # http://localhost:5173
```

---

## Модели данных

### User
```
{ fullname: String(45), login: String(12) UNIQUE, password: String(45),
  gender: enum['m','f'], role: enum['p','r'] }
```

### Post
```
{ title: String(45), description: String(700), publishDate: Number,
  imageFileName: String, pdfFileName: String,
  autorFullName: String(45), author: ObjectId → User }
```

**Связь:** User (1) → Post (N)

ER-диаграмма: [docs/08-er-diagrams/er-diagram.md](docs/08-er-diagrams/er-diagram.md)

---

## Реализованный функционал

### Backend
- [x] Express REST API (8 эндпоинтов)
- [x] MongoDB + Mongoose (User, Post)
- [x] JWT-аутентификация (HTTP-only cookie)
- [x] Zod-валидация входящих данных
- [x] Multer — загрузка image + PDF (`multipart/form-data`)
- [x] express.static — раздача медиафайлов
- [x] CORS (`credentials: true`)
- [x] Middleware `verifySession`
- [x] Service layer (UserService, PostService)

### Frontend
- [x] React SPA, 6 страниц
- [x] React Router DOM 6 (клиентская маршрутизация)
- [x] Axios API layer (centralised instance, withCredentials)
- [x] ProfileContext + ModalContext (React Context API)
- [x] 5 custom hooks (useAuth, useRegister, useExplore, usePost, useRead)
- [x] Shared UI Kit (Button, Input, TextArea, Checkbox)
- [x] Пагинация ленты публикаций
- [x] Модальные уведомления об ошибках/успехе

---

## Документация

| # | Документ | Ссылка |
|---|---|---|
| 01 | IDEF0 — функциональная модель | [docs/01-idef0-diagrams/](docs/01-idef0-diagrams/idef0.md) |
| 02 | BUC-диаграмма + матрица стейкхолдеров | [docs/02-buc-diagrams/](docs/02-buc-diagrams/buc-diagram.md) |
| 03 | SWOT-анализ | [docs/03-swot-analysis/](docs/03-swot-analysis/swot.md) |
| 04 | Use Case + спецификации | [docs/04-use-case/](docs/04-use-case/use-case.md) |
| 05 | Доменная модель | [docs/05-domain-model/](docs/05-domain-model/domain-model.md) |
| 06 | Архитектура компонентов + JWT-схема | [docs/06-architecture/](docs/06-architecture/architecture.md) |
| 07 | REST API спецификация | [docs/07-api-spec/](docs/07-api-spec/api-spec.md) |
| 08 | ER-диаграмма + DDL MongoDB | [docs/08-er-diagrams/](docs/08-er-diagrams/er-diagram.md) |
| 09 | WBS + Диаграмма Ганта + COCOMO | [docs/09-wbs-gantt/](docs/09-wbs-gantt/wbs-gantt.md) |
| 10 | Техническое задание | [docs/10-technical-spec/](docs/10-technical-spec/tz.md) |
| 11 | Руководство пользователя | [docs/11-user-manual/](docs/11-user-manual/user-manual.md) |
| 12 | Руководство администратора | [docs/12-admin-manual/](docs/12-admin-manual/admin-manual.md) |
| — | Пояснительная записка (PDF) | [ПОЯСНИТЕЛЬНАЯ_ЗАПИСКА.pdf](ПОЯСНИТЕЛЬНАЯ_ЗАПИСКА.pdf) |

### Дополнительные материалы
- [docs/ЗапискаТЗ.md](docs/ЗапискаТЗ.md) — Техническая записка
- [docs/Руководство Пользователя.md](docs/Руководство%20Пользователя.md) — Сценарии пользователей
- [docs/Глосарий.md](docs/Глосарий.md) — Глоссарий терминов

---

## Обоснование выбора Node.js вместо Django

Траектория Б допускает выбор технологического стека при условии реализации всех функциональных требований. Выбор Node.js + Express + MongoDB обоснован:

1. **Единый язык стека** — React и Node.js на JavaScript упрощают разработку и поддержку
2. **Асинхронная модель** — Node.js оптимален для файловых операций (Multer) и I/O MongoDB
3. **Гибкость Express** — минимальный фреймворк без ORM-магии, полный контроль над архитектурой
4. **MERN-стек** — широко применяется в индустрии, актуален для портфолио

---

## Статистика разработки

| Показатель | Значение |
|---|---|
| Всего коммитов | 6 |
| Период разработки | 08.06.2026 — 10.06.2026 |
| Ветка | `main` |
| Языки | JavaScript (ESM), CSS, HTML |
| Зависимостей backend | 8 |
| Зависимостей frontend | 5 |

---

## Соответствие критериям Траектории Б

| Критерий | Требование | Реализовано |
|---|---|---|
| Модели данных | 2+ модели, связи, FK | User + Post (1:N) |
| REST API | 8+ эндпоинтов | 8 эндпоинтов |
| Валидация | Схемная валидация данных | Zod (server-side) |
| JWT-аутентификация | Токены, защита маршрутов | JWT + HTTP-only cookie + verifySession |
| React frontend | 5+ компонентов, маршрутизация | 6 страниц + 3 компонента + UI Kit |
| Интеграция | CORS, Axios, обработка ошибок | Axios (withCredentials) + CORS + 400/401/403/404/500 |
| Качество кода | Читаемость, структура | FSD, ESLint, Prettier, Service Layer |
