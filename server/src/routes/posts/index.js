import express from 'express';
import multer from 'multer';

// ============================
// Пользовательские импорты
// ============================

import { verifySession } from '../../middleware/verifySession.js';
import { publish } from './publish.js';
import { read } from './read.js';
import { explore } from './explore.js';

// ============================
// Инициализация
// ============================

const postsRouter = express.Router();
const upload = multer({
  dest: 'uploads/',
});

// ============================
// Роутер постов
// ============================

// На рег пути переписать
postsRouter.use(verifySession);

postsRouter.post(
  '/publish',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
  ]),
  publish,
);

postsRouter.get('/read/:id', read);
postsRouter.get('/explore', explore);

export { postsRouter };
