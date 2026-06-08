import { z } from 'zod';
import { MongoServerError } from 'mongodb';
import { rename, unlink } from 'fs/promises';
import { decodeJwt } from 'jose';
import path from 'path';

// ============================
// Пользовательские импорты
// ============================

import { createPost, deletePostById, updatePostById } from '../../services/PostService.js';
import { findByLogin } from '../../services/UserService.js';
import { publishSchema } from '../../validation/zod/session.js';

async function publish(req, res) {
  let newPostID = null;
  let newPostImagePath = '';
  let newPostPdfPath = '';

  try {
    const postMeta = JSON.parse(req.body.metadata);
    const validatedData = publishSchema.parse(postMeta.post);

    if (!req.files?.image?.[0] || !req.files?.pdf?.[0]) {
      return res.status(400).json({
        success: false,
        error: 'Files are required',
      });
    }

    // У меня есть другая middleware функция на пути, что делает Verify и актуальность сессии, поэтому тут такая форма безопасна
    const jwtToken = req.cookies.sessionKey;
    const credentials = decodeJwt(jwtToken);
    const authorInDB = await findByLogin(credentials.login);

    const imageExt = path.extname(req.files.image[0].originalname);
    const fileExt = path.extname(req.files.pdf[0].originalname);

    const newPost = await createPost({
      ...validatedData,
      publishDate: Date.now(),
      author: authorInDB._id,
    });

    newPostID = newPost._id;
    const imagePath = path.resolve('file_storage', 'posts', `${newPostID}${imageExt}`);
    const pdfPath = path.resolve('file_storage', 'posts', `${newPostID}${fileExt}`);

    await rename(req.files.image[0].path, imagePath);
    newPostImagePath = imagePath;

    await rename(req.files.pdf[0].path, pdfPath);
    newPostPdfPath = pdfPath;

    const imageFileName = `${newPostID}${imageExt}`;
    const pdfFileName = `${newPostID}${fileExt}`;
    await updatePostById(newPostID, {
      imageFileName,
      pdfFileName,
    });

    res.status(201).json({
      success: true,
      post: {
        id: newPostID,
      },
      message: '',
    });
  } catch (error) {
    if (newPostID) {
      try {
        await deletePostById(newPostID);
        console.log(`Удален поврежденный пост: ${newPostID}`);
      } catch (cleanupErr) {
        console.error('Ошибка удаления поста:', cleanupErr);
      }
    }

    if (newPostImagePath) {
      try {
        await unlink(newPostImagePath);
      } catch {
        /*empty*/
      }
    }

    if (newPostPdfPath) {
      try {
        await unlink(newPostPdfPath);
      } catch {
        /*empty*/
      }
    }

    // 4. Обработка ошибок валидации
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
      });
    }

    // 4. Обработка ошибок валидации
    if (error instanceof MongoServerError) {
      return res.status(409).json({
        success: false,
        error: 'Schema conflict',
      });
    }

    // Обработка других ошибок
    console.error('Publish error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
}

export { publish };
