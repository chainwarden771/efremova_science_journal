import { MongoServerError } from 'mongodb';

// ============================
// Пользовательские импорты
// ============================

import { getPostById } from '../../services/PostService.js';

async function read(req, res) {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        error: 'invalid postID param',
      });
    }

    const currentPost = await getPostById(req.params.id);

    if (!currentPost) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    res.status(200).json({ ...currentPost });
  } catch (error) {
    // 4. Обработка ошибок BD
    if (error instanceof MongoServerError) {
      return res.status(400).json({
        success: false,
        error: 'Bad Schema',
      });
    }

    // Обработка других ошибок
    console.error('Read error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
}

export { read };
