import Post from '../entities/Post.js';
import { ObjectId } from 'mongodb'; // Импортируем ObjectId для проверки типа

/**
 * Создаёт новый пост.
 * @param {Object} postData - Данные для создания поста { title, description, publishDate, author }.
 *                           Поле author должно быть ObjectId пользователя.
 * @returns {Promise<Object>} Созданный документ поста.
 */
export async function createPost(postData) {
  // Проверяем postData - не пустой объект, не массив
  if (!postData || typeof postData !== 'object' || Array.isArray(postData)) {
    throw new Error('Post data must be a non-null object');
  }

  // Проверяем, что author - это ObjectId или его строковое представление
  // Пример проверки (требует import { ObjectId } from 'mongodb'; в начале файла):
  // if (!postData.author || (!ObjectId.isValid(postData.author) && !(postData.author instanceof ObjectId))) {
  //   throw new Error('Author must be a valid ObjectId or its string representation');
  // }

  // Проверки для title, description, publishDate можно добавить здесь,
  // если нужно раньше, чем на уровне схемы Mongoose

  return await Post.create(postData);
}

/**
 * Получает пост по его MongoDB ObjectId.
 * @param {string|ObjectId} postId - ObjectId поста в виде строки или ObjectId.
 * @returns {Promise<Object|null>} Найденный документ поста или null.
 */
export async function getPostById(postId) {
  let validId;
  if (typeof postId === 'string') {
    if (!ObjectId.isValid(postId)) {
      throw new Error('Invalid Post ID format');
    }
    validId = new ObjectId(postId);
  } else if (postId instanceof ObjectId) {
    validId = postId;
  } else {
    throw new Error('Post ID must be a string or ObjectId');
  }

  // Используем .lean() для получения POJO
  return await Post.findById(validId).lean();
}

/**
 * Обновляет пост по его MongoDB ObjectId.
 * @param {string|ObjectId} postId - ObjectId поста в виде строки или ObjectId.
 * @param {Object} updateData - Объект с полями для обновления.
 * @returns {Promise<Object|null>} Обновлённый документ поста или null, если не найден.
 */
export async function updatePostById(postId, updateData) {
  let validId;
  if (typeof postId === 'string') {
    if (!ObjectId.isValid(postId)) {
      throw new Error('Invalid Post ID format');
    }
    validId = new ObjectId(postId);
  } else if (postId instanceof ObjectId) {
    validId = postId;
  } else {
    throw new Error('Post ID must be a string or ObjectId');
  }

  if (!updateData || typeof updateData !== 'object' || Array.isArray(updateData)) {
    throw new Error('Update data must be a non-null object');
  }

  // Убираем поля, которые не следует обновлять через этот метод (например, _id)
  const { _id, ...safeUpdateData } = updateData;

  return await Post.findByIdAndUpdate(
    { _id: validId }, // Фильтр
    { $set: safeUpdateData }, // Данные для обновления
    { new: true, lean: true }, // Опции: new=true возвращает обновлённый документ, lean=true POJO
  );
}

/**
 * Получает все посты.
 * @returns {Promise<Array>}
 */
export async function getAllPosts() {
  return await Post.find({}).sort({ publishDate: -1 }).lean();
}

/**
 * Удаляет пост по его MongoDB ObjectId.
 * @param {string|ObjectId} postId - ObjectId поста в виде строки или ObjectId.
 * @returns {Promise<{deletedCount: number}|null>} Объект с количеством удалённых документов или null, если пост не найден.
 */
export async function deletePostById(postId) {
  let validId;
  if (typeof postId === 'string') {
    if (!ObjectId.isValid(postId)) {
      throw new Error('Invalid Post ID format');
    }
    validId = new ObjectId(postId);
  } else if (postId instanceof ObjectId) {
    validId = postId;
  } else {
    throw new Error('Post ID must be a string or ObjectId');
  }

  const result = await Post.deleteOne({ _id: validId });
  if (result.deletedCount === 0) {
    return null; // Пост не найден
  }
  return { deletedCount: result.deletedCount };
}

/**
 * Получает посты с пагинацией и фильтрацией.
 * @param {Object} options - Опции запроса { page, limit, titleFilter, dateFrom, dateTo }.
 * @returns {Promise<Object>} Объект с постами и метаданными.
 */
export async function getFilteredPosts(options = {}) {
  const { page = 1, limit = 10, titleFilter = '', dateFrom = null, dateTo = null } = options;

  if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1 || limit > 100) {
    throw new Error('Invalid pagination parameters');
  }

  const filter = {};

  if (titleFilter.trim()) {
    filter.title = {
      $regex: titleFilter.trim(),
      $options: 'i',
    };
  }

  if (dateFrom !== null || dateTo !== null) {
    filter.publishDate = {};

    if (dateFrom !== null) {
      const startOfDay = new Date(dateFrom);
      startOfDay.setHours(0, 0, 0, 0);

      filter.publishDate.$gte = startOfDay.getTime();
    }

    if (dateTo !== null) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);

      filter.publishDate.$lte = endOfDay.getTime();
    }
  }

  const totalPosts = await Post.countDocuments(filter);

  const totalPages = Math.ceil(totalPosts / limit);

  const skip = (page - 1) * limit;

  const posts = await Post.find(filter).sort({ publishDate: -1 }).skip(skip).limit(limit).lean();

  return {
    posts,
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    },
  };
}
