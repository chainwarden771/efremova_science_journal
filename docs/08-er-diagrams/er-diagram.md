# ER-диаграмма и физическая модель данных

> Проект: ScienceJournal — Платформа публикации научных статей  
> Группа: ПИЖ-б-о-24-1 | СКФУ, 2026  
> СУБД: MongoDB (документно-ориентированная NoSQL)

---

## Логическая ER-диаграмма

```
┌─────────────────────────────┐          ┌─────────────────────────────────────┐
│           USERS             │          │               POSTS                  │
├─────────────────────────────┤          ├─────────────────────────────────────┤
│ PK  _id        : ObjectId   │          │ PK  _id           : ObjectId        │
│     fullname   : String(45) │          │     title         : String(45)      │
│     login      : String(12) │ 1 ──── * │     description   : String(700)     │
│     password   : String(45) │          │     publishDate   : Number          │
│     gender     : String     │◄─────────│ FK  author        : ObjectId        │
│     role       : String     │          │     autorFullName : String(45)      │
└─────────────────────────────┘          │     imageFileName : String(100)     │
                                         │     pdfFileName   : String(100)     │
                                         └─────────────────────────────────────┘
```

**Кардинальность:** Один пользователь → Много публикаций (1:N)

---

## Физическая модель данных (Mongoose Schemas)

### Коллекция `users`

```javascript
// server/src/entities/User.js
const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    maxlength: 45,
    required: true,
  },
  login: {
    type: String,
    maxlength: 12,
    unique: true,       // Индекс уникальности
    required: true,
  },
  password: {
    type: String,
    maxlength: 45,
    required: true,
  },
  gender: {
    type: String,
    enum: ['m', 'f'],
    required: true,
  },
  role: {
    type: String,
    enum: ['p', 'r'],   // p = publisher, r = reader
    required: true,
  },
});
```

### Коллекция `posts`

```javascript
// server/src/entities/Post.js
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 45,
    required: true,
  },
  description: {
    type: String,
    maxlength: 700,
    required: true,
  },
  publishDate: {
    type: Number,
    required: true,     // Unix timestamp (Date.now())
  },
  imageFileName: {
    type: String,
    maxlength: 100,
  },
  pdfFileName: {
    type: String,
    maxlength: 100,
  },
  autorFullName: {
    type: String,
    maxlength: 45,
    required: true,     // Денормализованное поле
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,     // ForeignKey → users._id
  },
});
```

---

## DDL-скрипты (MongoDB Shell)

```javascript
// 1. Создание базы данных и коллекции users
use sciencejournal_db;

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["fullname", "login", "password", "gender", "role"],
      properties: {
        fullname: { bsonType: "string", maxLength: 45 },
        login: { bsonType: "string", maxLength: 12 },
        password: { bsonType: "string", maxLength: 45 },
        gender: { enum: ["m", "f"] },
        role: { enum: ["p", "r"] }
      }
    }
  }
});

// 2. Уникальный индекс на login
db.users.createIndex({ login: 1 }, { unique: true });

// 3. Создание коллекции posts
db.createCollection("posts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "description", "publishDate", "autorFullName", "author"],
      properties: {
        title: { bsonType: "string", maxLength: 45 },
        description: { bsonType: "string", maxLength: 700 },
        publishDate: { bsonType: "number" },
        imageFileName: { bsonType: "string", maxLength: 100 },
        pdfFileName: { bsonType: "string", maxLength: 100 },
        autorFullName: { bsonType: "string", maxLength: 45 },
        author: { bsonType: "objectId" }
      }
    }
  }
});

// 4. Индекс по автору для быстрой фильтрации
db.posts.createIndex({ author: 1 });

// 5. Индекс по дате для сортировки ленты
db.posts.createIndex({ publishDate: -1 });
```

---

## Описание связей и ограничений

### Foreign Key: Post.author → User._id

| Аспект | Значение |
|---|---|
| **Тип** | ObjectId (ссылка) |
| **on_delete** | В MongoDB нет каскадного удаления. При удалении User посты с `author` = его `_id` остаются (Restrict-like поведение через приложение) |
| **Populated** | Через `Post.populate('author')` при необходимости |
| **Обязательность** | required: true — каждый пост имеет автора |

### Уникальный индекс: User.login

| Аспект | Значение |
|---|---|
| **Индекс** | `{ login: 1 }, { unique: true }` |
| **Ошибка** | MongoDB выбрасывает DuplicateKey (код 11000) |
| **Обработка** | Сервер возвращает HTTP 409 Conflict |

---

## Нормализация данных

### Оценка нормальных форм

**1НФ (Первая нормальная форма) — соблюдена:**
- Все поля атомарны (нет массивов в documents User и Post)
- Каждый документ имеет уникальный первичный ключ (`_id`)

**2НФ (Вторая нормальная форма) — соблюдена:**
- Составных ключей нет — PK простые (ObjectId)
- Все не-ключевые поля полностью зависят от PK

**3НФ (Третья нормальная форма) — частично:**
- `Post.autorFullName` — денормализованное поле (намеренное нарушение 3НФ для производительности)
- Обоснование: избегает JOIN при отображении ленты (MongoDB не поддерживает JOIN нативно без $lookup)
- Компромисс принят: при изменении имени автора потребуется обновление всех его постов

---

## Образцы данных (Seed Data)

```javascript
// Тестовый пользователь-публицист
db.users.insertOne({
  fullname: "Александр Соколов",
  login: "sokolov",
  password: "$2b$10$...", // bcrypt hash
  gender: "m",
  role: "p"
});

// Тестовый пользователь-читатель
db.users.insertOne({
  fullname: "Мария Кузнецова",
  login: "m_kuznec",
  password: "$2b$10$...",
  gender: "f",
  role: "r"
});

// Тестовая публикация
db.posts.insertOne({
  title: "Нейронные сети 2026",
  description: "Обзор последних достижений в области нейронных сетей и их применения в науке.",
  publishDate: 1748000000000,
  imageFileName: "664f1234_image.jpg",
  pdfFileName: "664f1234_article.pdf",
  autorFullName: "Александр Соколов",
  author: ObjectId("664f1234...")
});
```
