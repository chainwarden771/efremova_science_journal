# Доменная модель — Domain Model

> Проект: ScienceJournal — Платформа публикации научных статей  
> Группа: ПИЖ-б-о-24-1 | СКФУ, 2026

---

## Диаграмма классов (Domain Model)

```
┌────────────────────────────────┐         ┌────────────────────────────────────┐
│           User                 │         │              Post                  │
├────────────────────────────────┤         ├────────────────────────────────────┤
│ _id        : ObjectId (PK)     │         │ _id           : ObjectId (PK)      │
│ fullname   : String(45)        │ 1    *  │ title         : String(45)         │
│ login      : String(12) UNIQUE │─────────│ description   : String(700)        │
│ password   : String(45)        │         │ publishDate   : Number (Unix ms)   │
│ gender     : Enum['m','f']     │         │ imageFileName : String(100)        │
│ role       : Enum['p','r']     │         │ pdfFileName   : String(100)        │
└────────────────────────────────┘         │ autorFullName : String(45)         │
                                           │ author        : ObjectId (FK→User) │
                                           └────────────────────────────────────┘

┌────────────────────────────────┐
│          Session               │
├────────────────────────────────┤
│ jwt       : String (JWT)       │
│ httpOnly  : Boolean            │
│ expires   : Date               │
│ userId    : ObjectId (FK→User) │
└────────────────────────────────┘

┌────────────────────────────────┐
│        FileStorage             │
├────────────────────────────────┤
│ postId    : ObjectId           │
│ imagePath : String             │
│ pdfPath   : String             │
│ baseDir   : 'file_storage/posts'│
└────────────────────────────────┘
```

---

## Описание сущностей

### User — Пользователь

Центральная сущность аутентификации. Хранится в MongoDB-коллекции `users`.

| Поле | Тип | Ограничения | Описание |
|---|---|---|---|
| `_id` | ObjectId | PK, auto | Уникальный идентификатор |
| `fullname` | String | maxlength: 45, required | Полное имя пользователя |
| `login` | String | maxlength: 12, unique, required | Уникальный логин |
| `password` | String | maxlength: 45, required | Хэш пароля |
| `gender` | String | enum: ['m', 'f'], required | Пол пользователя |
| `role` | String | enum: ['p', 'r'], required | Роль: publisher или reader |

**Бизнес-правила:**
- Логин должен быть уникальным в системе
- Роль определяется при регистрации и не меняется через UI
- Пароль хранится в хэшированном виде

---

### Post — Публикация

Основная сущность предметной области. Хранится в коллекции `posts`.

| Поле | Тип | Ограничения | Описание |
|---|---|---|---|
| `_id` | ObjectId | PK, auto | Уникальный идентификатор |
| `title` | String | maxlength: 45, required | Заголовок статьи |
| `description` | String | maxlength: 700, required | Текст/описание статьи |
| `publishDate` | Number | required | Дата публикации (Unix timestamp, мс) |
| `imageFileName` | String | maxlength: 100 | Имя файла обложки |
| `pdfFileName` | String | maxlength: 100 | Имя файла PDF-статьи |
| `autorFullName` | String | maxlength: 45, required | Полное имя автора (денормализация) |
| `author` | ObjectId | FK→User, required | Ссылка на создателя |

**Бизнес-правила:**
- Публикацию может создать только пользователь с ролью `p`
- `publishDate` устанавливается на сервере при создании (`Date.now()`)
- `autorFullName` — денормализованное поле для быстрого отображения без JOIN

---

### Session (концептуальная сущность)

Не хранится явно в MongoDB. Реализована через JWT в HTTP-only cookie.

| Поле | Описание |
|---|---|
| JWT payload | `{ userId, role, iat, exp }` |
| Transport | HTTP-only cookie `sessionKey` |
| Lifecycle | Создаётся при auth/register, уничтожается при logout |

---

### FileStorage (концептуальная сущность)

Физическое хранилище медиафайлов на файловой системе сервера.

| Параметр | Значение |
|---|---|
| Базовая директория | `server/file_storage/posts/` |
| Соглашение об именах | `{postId}_image.{ext}`, `{postId}_pdf.pdf` |
| Доступ | `GET /file_storage/posts/{filename}` через express.static |

---

## Связи между сущностями

| Связь | Тип | Описание |
|---|---|---|
| User → Post | Один-ко-многим (1:N) | Один пользователь может создать несколько публикаций |
| Post → FileStorage | Один-к-одному (1:1) | Каждый пост имеет не более одного изображения и одного PDF |
| User → Session | Один-к-одному (1:1) | Одна активная сессия на пользователя |

---

## Бизнес-правила системы

| Код | Правило |
|---|---|
| BR-1 | Доступ к эндпоинтам `/api/posts/` требует валидного JWT |
| BR-2 | Только роль `p` (publisher) может вызвать `POST /api/posts/publish` |
| BR-3 | Удаление поста возможно только его автором |
| BR-4 | Логин должен быть уникальным (MongoDB unique index) |
| BR-5 | Файлы хранятся только форматов `image/*` и `application/pdf` |
| BR-6 | `publishDate` устанавливается сервером, клиент не управляет им |
