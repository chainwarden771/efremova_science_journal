# Спецификация REST API

> Проект: ScienceJournal — Платформа публикации научных статей  
> Группа: ПИЖ-б-о-24-1 | СКФУ, 2026  
> Base URL: `http://localhost:3000/api`

---

## Сводная таблица эндпоинтов

| # | Метод | Эндпоинт | Доступ | Описание |
|---|---|---|---|---|
| 1 | POST | `/session/register` | Публичный | Регистрация нового пользователя |
| 2 | POST | `/session/auth` | Публичный | Аутентификация (выдача JWT) |
| 3 | POST | `/session/status` | Публичный | Проверка текущей сессии |
| 4 | POST | `/session/logout` | Авторизованные | Завершение сессии |
| 5 | GET | `/posts/explore` | Авторизованные | Лента публикаций с пагинацией |
| 6 | GET | `/posts/read/:id` | Авторизованные | Детальный просмотр публикации |
| 7 | POST | `/posts/publish` | Publisher (роль `p`) | Создание публикации с файлами |
| 8 | GET | `/file_storage/posts/:filename` | Все | Скачивание медиафайла (static) |

**Итого: 8 эндпоинтов** (соответствует требованию ≥8 для Траектории Б)

---

## Аутентификация

Все защищённые эндпоинты требуют JWT в cookie:
```
Cookie: sessionKey=<JWT-token>
```

Middleware `verifySession` автоматически проверяет токен перед обработчиком.

---

## 1. POST /session/register

Регистрация нового пользователя.

**Запрос:**
```http
POST /api/session/register
Content-Type: application/json

{
  "fullname": "Иван Петров",
  "login": "ivan2026",
  "password": "secret123",
  "gender": "m",
  "role": "p"
}
```

**Поля запроса:**
| Поле | Тип | Обязательное | Ограничения |
|---|---|---|---|
| fullname | string | Да | maxlength: 45 |
| login | string | Да | maxlength: 12, уникальный |
| password | string | Да | maxlength: 45 |
| gender | string | Да | enum: 'm' / 'f' |
| role | string | Да | enum: 'p' (publisher) / 'r' (reader) |

**Ответ 200 OK:**
```http
Set-Cookie: sessionKey=<JWT>; HttpOnly; Path=/

{
  "message": "Пользователь зарегистрирован"
}
```

**Ошибки:**
| Код | Причина |
|---|---|
| 400 | Ошибка валидации Zod (неверные поля) |
| 409 | Логин уже занят (MongoDB duplicate key) |

---

## 2. POST /session/auth

Аутентификация существующего пользователя.

**Запрос:**
```http
POST /api/session/auth
Content-Type: application/json

{
  "login": "ivan2026",
  "password": "secret123"
}
```

**Ответ 200 OK:**
```http
Set-Cookie: sessionKey=<JWT>; HttpOnly; Path=/

{
  "message": "Авторизация прошла успешно",
  "user": {
    "_id": "664f...",
    "fullname": "Иван Петров",
    "role": "p"
  }
}
```

**Ошибки:**
| Код | Причина |
|---|---|
| 400 | Ошибка валидации |
| 401 | Неверный логин или пароль |

---

## 3. POST /session/status

Проверка статуса текущей сессии.

**Запрос:**
```http
POST /api/session/status
Cookie: sessionKey=<JWT>
```

**Ответ 200 OK (авторизован):**
```json
{
  "authorized": true,
  "user": {
    "_id": "664f...",
    "fullname": "Иван Петров",
    "role": "p"
  }
}
```

**Ответ 200 OK (не авторизован):**
```json
{
  "authorized": false
}
```

---

## 4. POST /session/logout

Завершение сессии, очистка cookie.

**Запрос:**
```http
POST /api/session/logout
Cookie: sessionKey=<JWT>
```

**Ответ 200 OK:**
```http
Set-Cookie: sessionKey=; Max-Age=0

{
  "message": "Выход выполнен"
}
```

---

## 5. GET /posts/explore

Лента публикаций с пагинацией.

**Запрос:**
```http
GET /api/posts/explore?page=1&limit=10
Cookie: sessionKey=<JWT>
```

**Параметры запроса:**
| Параметр | Тип | Default | Описание |
|---|---|---|---|
| page | number | 1 | Номер страницы |
| limit | number | 10 | Количество записей на странице |

**Ответ 200 OK:**
```json
{
  "posts": [
    {
      "_id": "664f...",
      "title": "Квантовые вычисления",
      "description": "Краткое описание...",
      "publishDate": 1748000000000,
      "imageFileName": "664f_image.jpg",
      "autorFullName": "Иван Петров"
    }
  ],
  "total": 42,
  "page": 1,
  "totalPages": 5
}
```

**Ошибки:**
| Код | Причина |
|---|---|
| 401 | JWT не передан или недействителен |

---

## 6. GET /posts/read/:id

Детальный просмотр публикации.

**Запрос:**
```http
GET /api/posts/read/664f...
Cookie: sessionKey=<JWT>
```

**Ответ 200 OK:**
```json
{
  "_id": "664f...",
  "title": "Квантовые вычисления",
  "description": "Полный текст описания статьи...",
  "publishDate": 1748000000000,
  "imageFileName": "664f_image.jpg",
  "pdfFileName": "664f_article.pdf",
  "autorFullName": "Иван Петров",
  "author": "664a..."
}
```

**URL файлов:**
- Изображение: `GET /file_storage/posts/{imageFileName}`
- PDF: `GET /file_storage/posts/{pdfFileName}`

**Ошибки:**
| Код | Причина |
|---|---|
| 401 | Не авторизован |
| 404 | Публикация не найдена |

---

## 7. POST /posts/publish

Создание новой публикации с медиафайлами.

**Запрос:**
```http
POST /api/posts/publish
Cookie: sessionKey=<JWT>
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="title"
Квантовые вычисления в 2026

--boundary
Content-Disposition: form-data; name="description"
Обзор последних достижений в области квантовых вычислений...

--boundary
Content-Disposition: form-data; name="image"; filename="cover.jpg"
Content-Type: image/jpeg
<binary data>

--boundary
Content-Disposition: form-data; name="pdf"; filename="article.pdf"
Content-Type: application/pdf
<binary data>
```

**Поля запроса:**
| Поле | Тип | Обязательное | Ограничения |
|---|---|---|---|
| title | string | Да | maxlength: 45 |
| description | string | Да | maxlength: 700 |
| image | File | Нет | Изображение обложки |
| pdf | File | Нет | PDF-файл статьи |

**Ответ 201 Created:**
```json
{
  "message": "Публикация создана",
  "post": {
    "_id": "664f...",
    "title": "Квантовые вычисления в 2026",
    "publishDate": 1748123456789
  }
}
```

**Ошибки:**
| Код | Причина |
|---|---|
| 400 | Ошибка валидации |
| 401 | Не авторизован |
| 403 | Недостаточно прав (роль `r`) |

---

## 8. GET /file_storage/posts/:filename

Статическая раздача медиафайлов через `express.static`.

**Запрос:**
```http
GET /file_storage/posts/664f_image.jpg
```

**Ответ:** Бинарный файл (image/jpeg, application/pdf и т.д.)

**Доступ:** Публичный (без авторизации), т.к. URL содержит непредсказуемый ObjectId.

---

## Коды ответов

| Код | Значение |
|---|---|
| 200 | OK — запрос выполнен успешно |
| 201 | Created — ресурс создан |
| 400 | Bad Request — ошибка валидации |
| 401 | Unauthorized — не авторизован / JWT истёк |
| 403 | Forbidden — недостаточно прав |
| 404 | Not Found — ресурс не найден |
| 409 | Conflict — конфликт данных (дублирующий логин) |
| 500 | Internal Server Error |

---

## CORS-конфигурация

```javascript
const corsOptions = {
  origin: 'http://localhost:5173',  // Vite dev server
  credentials: true,                 // передача cookies
};
```

В production значение `origin` заменяется на реальный домен фронтенда.
