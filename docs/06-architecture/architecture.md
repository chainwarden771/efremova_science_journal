# Архитектурное проектирование

> Проект: ScienceJournal — Платформа публикации научных статей  
> Группа: ПИЖ-б-о-24-1 | СКФУ, 2026

---

## Архитектурный стиль

Система построена по классической **клиент-серверной архитектуре** с разделением на:
- **Frontend SPA** (Single Page Application) — React-приложение в браузере
- **Backend REST API** — Node.js + Express-сервер
- **База данных** — MongoDB
- **Файловое хранилище** — локальная файловая система (file_storage/)

Взаимодействие осуществляется через **REST API** с **JWT-аутентификацией** через HTTP-only cookies.

---

## Диаграмма компонентов

```
╔══════════════════════════════════════════════════════════╗
║                  CLIENT (браузер)                        ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │                  React SPA (Vite)                    │ ║
║  │                                                     │ ║
║  │  pages/          components/      features/         │ ║
║  │  ├─ Welcome      ├─ Header        ├─ session/       │ ║
║  │  ├─ Auth         ├─ Modal         │  ├─ useAuth     │ ║
║  │  ├─ Register     └─ Post          │  └─ useRegister │ ║
║  │  ├─ Explore                       └─ posts/         │ ║
║  │  ├─ Publish      shared/             ├─ useExplore  │ ║
║  │  └─ Read         ├─ UI Kit           ├─ usePost     │ ║
║  │                  ├─ context/         └─ useRead     │ ║
║  │                  │  ├─ ProfileCtx                   │ ║
║  │                  │  └─ ModalCtx                     │ ║
║  │                  └─ api/           ← Axios layer    │ ║
║  └──────────────────────┬────────────────────────────--┘ ║
║                         │  HTTP/REST (CORS)               ║
╚═════════════════════════╪════════════════════════════════╝
                          │
╔═════════════════════════╪════════════════════════════════╗
║                  SERVER (Node.js)                        ║
║                         │                                ║
║  ┌──────────────────────▼──────────────────────────────┐ ║
║  │              Express Application                     │ ║
║  │                                                     │ ║
║  │  routes/session/         routes/posts/              │ ║
║  │  ├─ POST /register       ├─ GET /explore            │ ║
║  │  ├─ POST /auth           ├─ GET /read/:id           │ ║
║  │  ├─ POST /status         └─ POST /publish           │ ║
║  │  └─ POST /logout                                    │ ║
║  │                                                     │ ║
║  │  middleware/             services/                  │ ║
║  │  └─ verifySession        ├─ UserService             │ ║
║  │                          ├─ PostService             │ ║
║  │  validation/             └─ mongoService            │ ║
║  │  └─ Zod schemas                                     │ ║
║  │                                                     │ ║
║  │  Multer ──────────────────────────────────────────► │ ║
║  │  file_storage/posts/     express.static             │ ║
║  └──────────────────────────────────────────────────---┘ ║
║                         │                                ║
╚═════════════════════════╪════════════════════════════════╝
                          │
              ┌───────────▼───────────┐
              │    MongoDB            │
              │  ┌────────────────┐   │
              │  │  Collection:   │   │
              │  │   users        │   │
              │  ├────────────────┤   │
              │  │  Collection:   │   │
              │  │   posts        │   │
              │  └────────────────┘   │
              └───────────────────────┘
```

---

## Диаграмма слоёв Frontend (FSD)

```
┌──────────────────────────────────────────────────────────┐
│  App.jsx — корневой компонент, маршрутизация (React Router)│
├──────────────────────────────────────────────────────────┤
│  pages/                                                  │
│  ├── Welcome    (приветственная страница)                │
│  ├── Auth       (форма входа)                            │
│  ├── Register   (форма регистрации)                      │
│  ├── Explore    (лента публикаций)                       │
│  ├── Publish    (форма публикации)                       │
│  └── Read       (просмотр статьи)                        │
├──────────────────────────────────────────────────────────┤
│  components/                                             │
│  ├── Header     (навигация + logout)                     │
│  ├── Modal      (всплывающие уведомления)                │
│  └── Post       (карточка публикации)                    │
├──────────────────────────────────────────────────────────┤
│  features/                                               │
│  ├── session/   useAuth, useRegister                     │
│  └── posts/     useExplore, usePost, useRead             │
├──────────────────────────────────────────────────────────┤
│  shared/                                                 │
│  ├── UI/        Button, Input, TextArea, Checkbox        │
│  ├── context/   ProfileContext, ModalContext             │
│  ├── hooks/     useProfileContext, useModalContext       │
│  ├── utils/     cookies, localStorage, sessionStorage    │
│  └── consts/    statusMessages                           │
├──────────────────────────────────────────────────────────┤
│  api/                                                    │
│  ├── app/index.js   (axios instance, baseURL, credentials)│
│  ├── session/       auth, register                       │
│  └── posts/         explore, publish, read               │
└──────────────────────────────────────────────────────────┘
```

---

## Схема JWT-аутентификации (поток токенов)

```
┌────────────┐                    ┌────────────────────────┐
│   CLIENT   │                    │        SERVER          │
└─────┬──────┘                    └──────────┬─────────────┘
      │                                      │
      │  POST /api/session/auth              │
      │  { login, password }                 │
      │ ─────────────────────────────────►  │
      │                                      │
      │                          Zod validate│
      │                          findUser()  │
      │                          bcrypt.compare│
      │                          jwt.sign()  │
      │                                      │
      │  200 OK                              │
      │  Set-Cookie: sessionKey=<JWT>;       │
      │  HttpOnly; Path=/                    │
      │ ◄─────────────────────────────────── │
      │                                      │
      │  GET /api/posts/explore              │
      │  Cookie: sessionKey=<JWT>            │
      │ ─────────────────────────────────►  │
      │                                      │
      │                    verifySession()   │
      │                    jwt.verify(token) │
      │                    req.user = payload│
      │                                      │
      │  200 OK { posts: [...] }             │
      │ ◄─────────────────────────────────── │
      │                                      │
      │  POST /api/session/logout            │
      │ ─────────────────────────────────►  │
      │                                      │
      │                    clearCookie()     │
      │  200 OK                              │
      │ ◄─────────────────────────────────── │
```

---

## Паттерны проектирования

| Паттерн | Применение |
|---|---|
| **MVC** | routes (Controller) + entities/services (Model) + React (View) |
| **Repository / Service Layer** | UserService, PostService — абстракция над MongoDB |
| **Factory** | Axios instance (`api/app/index.js`) — фабрика HTTP-клиента |
| **Observer / Context** | ProfileContext, ModalContext — глобальное состояние через React Context |
| **Middleware Pipeline** | Express pipeline: cookieParser → cors → verifySession → handler |
| **Custom Hooks** | useAuth, useExplore, usePost — изоляция бизнес-логики от UI |
| **FSD (Feature-Sliced Design)** | Организация frontend-кода по слоям и фичам |

---

## Технологический стек

### Backend

| Компонент | Технология | Версия |
|---|---|---|
| Runtime | Node.js | 18+ |
| Framework | Express | 4.x |
| Database | MongoDB (Mongoose driver) | 7.x |
| Auth | jsonwebtoken | 9.x |
| File upload | Multer | 1.x |
| Validation | Zod | 3.x |
| CORS | cors | 2.x |
| Cookies | cookie-parser | 1.x |
| Config | dotenv | 16.x |

### Frontend

| Компонент | Технология | Версия |
|---|---|---|
| Framework | React | 18.x |
| Build tool | Vite | 5.x |
| Routing | React Router DOM | 6.x |
| HTTP client | Axios | 1.x |
| State | Context API | (встроен в React) |
| Styling | CSS Modules + CSS | — |
