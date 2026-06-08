import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { mkdir, access } from 'fs/promises';

import { connectMongoDB } from './src/config/mongoDB.js';
import { configDotenv } from 'dotenv';

// ============================
// Пользовательские импорты
// ============================

import { sessionRouter } from './src/routes/session/index.js';
import { postsRouter } from './src/routes/posts/index.js';

// ============================
// Окружение
// ============================

configDotenv();
const PORT = process.env.PORT || 3000;

// ============================
// Инициализация
// ============================

// Файловое хранилище постов
try {
  // await mkdir('./file_storage');
  // await mkdir('./file_storage/posts');

  await access('./file_storage');
  console.log('Файловое хранилище найдено ✅');
} catch {
  console.log('Файловое хранилище создано 📂');
  await mkdir('./file_storage');
  await mkdir('./file_storage/posts');
}

await connectMongoDB();
const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use('/file_storage', express.static('./file_storage'));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(express.json());

const apiRouter = express.Router();

// ============================
// Использование роутеров
// ============================

apiRouter.use('/session/', sessionRouter);
apiRouter.use('/posts/', postsRouter);

// ============================
// Общие роуты
// ============================

app.use('/api/', apiRouter);

app.listen(3000, '0.0.0.0', () => {
  console.log(`👂 Прослушивание на: http://127.0.0.1:${PORT}`);
});
