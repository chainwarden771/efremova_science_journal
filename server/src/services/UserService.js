import User from '../entities/User.js';
import Post from '../entities/Post.js';

/**
 * Находит пользователя по логину.
 * @param {string} login - Логин пользователя.
 * @returns {Promise<Object|null>} Найденный документ пользователя или null.
 */
export async function findByLogin(login) {
  // Проверяем, что login - строка
  if (typeof login !== 'string' || login.trim().length === 0) {
    throw new Error('Login must be a non-empty string');
  }
  // Используем .lean() для получения POJO
  return await User.findOne({ login: login.trim() }).lean();
}

/**
 * Находит пользователя по логину.
 * @param {id} id - id строка записи.
 * @returns {Promise<Object|null>} Найденный документ пользователя или null.
 */
export async function findByID(id) {
  if (!id) {
    throw new Error('id is required');
  }

  return await User.findOne({ _id: id }).lean();
}

/**
 * Удаляет пользователя по логину и все его статьи.
 * @param {string} login - Логин пользователя для удаления.
 * @returns {Promise<{deletedCount: number, deletedPostsCount: number}|null>} Объект с количеством удалённых пользователей и статей или null, если пользователь не найден.
 */
export async function deleteByLogin(login) {
  if (typeof login !== 'string' || login.trim().length === 0) {
    throw new Error('Login must be a non-empty string');
  }

  // Находим пользователя, чтобы получить его _id
  const userToDelete = await User.findOne({ login: login.trim() });
  if (!userToDelete) {
    return null; // Пользователь не найден
  }

  const userId = userToDelete._id;

  // Удаляем статьи, у которых author ссылается на _id пользователя
  // Важно: используем поле 'author' из схемы Post, а не 'authorId'
  const deletePostsResult = await Post.deleteMany({ author: userId });

  // Удаляем самого пользователя
  const deleteUserResult = await User.deleteOne({ login: login.trim() });

  return {
    deletedCount: deleteUserResult.deletedCount,
    deletedPostsCount: deletePostsResult.deletedCount,
  };
}

/**
 * Обновляет данные пользователя по логину.
 * @param {string} login - Логин пользователя для обновления.
 * @param {Object} updateData - Объект с полями для обновления.
 * @returns {Promise<Object|null>} Обновлённый документ пользователя или null, если не найден.
 */
export async function updateByLogin(login, updateData) {
  if (typeof login !== 'string' || login.trim().length === 0) {
    throw new Error('Login must be a non-empty string');
  }
  // Проверяем updateData - не пустой объект, не массив
  if (!updateData || typeof updateData !== 'object' || Array.isArray(updateData)) {
    throw new Error('Update data must be a non-null object');
  }

  // Убираем поля, которые не следует обновлять через этот метод (например, _id)
  const { _id, ...safeUpdateData } = updateData;

  // Проверяем, нельзя ли обновить уникальное поле 'login', если оно передано
  // if ('login' in safeUpdateData) {
  //   throw new Error('Login cannot be updated directly');
  // }

  return await User.findOneAndUpdate(
    { login: login.trim() }, // Фильтр
    { $set: safeUpdateData }, // Данные для обновления
    { new: true, lean: true }, // Опции: new=true возвращает обновлённый документ, lean=true POJO
  );
}

/**
 * Создаёт нового пользователя.
 * @param {Object} userData - Данные для создания пользователя.
 * @returns {Promise<Object>} Созданный документ пользователя.
 */
export async function createUser(userData) {
  // Проверяем userData - не пустой объект, не массив
  if (!userData || typeof userData !== 'object' || Array.isArray(userData)) {
    throw new Error('User data must be a non-null object');
  }
  // Можно добавить проверки конкретных полей (fullname, login, password, gender, role)
  // например: if (!userData.fullname || !userData.login ...) throw new Error(...)
  return await User.create(userData);
}

/**
 * Получает список ObjectId статей, принадлежащих пользователю по его логину.
 * @param {string} login - Логин пользователя.
 * @returns {Promise<string[]|null>} Массив строк (ObjectId в виде строк) или null, если пользователь не найден.
 */
export async function getUserPostIds(login) {
  if (typeof login !== 'string' || login.trim().length === 0) {
    throw new Error('Login must be a non-empty string');
  }

  const user = await User.findOne({ login: login.trim() });
  if (!user) {
    return null; // Пользователь не найден
  }

  // Находим посты, у которых author ссылается на _id пользователя
  // Используем поле 'author' из схемы Post
  const posts = await Post.find({ author: user._id }, { _id: 1 }); // Проекция только _id
  // Возвращаем массив строк ObjectId
  return posts.map((post) => post._id.toString());
}
