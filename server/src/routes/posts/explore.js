import { MongoServerError } from 'mongodb';

// ============================
// Пользовательские импорты
// ============================

import { getFilteredPosts } from '../../services/PostService.js';

async function explore(req, res) {
  try {
    const { page = 1, limit = 10, title = '', dateFrom = null, dateTo = null } = req.query;

    const options = {
      page: Number(page),
      limit: Number(limit),
      titleFilter: title,
      dateFrom: dateFrom ? Number(dateFrom) : null,
      dateTo: dateTo ? Number(dateTo) : null,
    };

    const result = await getFilteredPosts(options);

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof MongoServerError) {
      return res.status(400).json({
        success: false,
        error: 'Bad Schema',
      });
    }

    console.error('Explore error:', error);

    return res.status(500).json({
      error: 'Internal server error during exploration',
    });
  }
}

export { explore };
