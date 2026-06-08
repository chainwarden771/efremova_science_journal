import { z } from 'zod';
import { MongoServerError } from 'mongodb';
import { SignJWT } from 'jose';

// ============================
// Пользовательские импорты
// ============================

import { findByLogin } from '../../services/UserService.js';
import { authSchema } from '../../validation/zod/session.js';

// ============================
// Окружение
// ============================

const SESSION_TIME = Number(process.env.SESSION_TIME) || 86400000;
const session_indays = `${SESSION_TIME / 86400000}d`;
const secret = new TextEncoder().encode(process.env.JWT_SIGN_KEY || 'Sx02Ks');

async function auth(req, res) {
  try {
    const validatedData = authSchema.parse(req.body.credentials);
    const user = await findByLogin(validatedData.login);

    // Безопасный способ авторизации
    if (!user || user.password !== validatedData.password) {
      return res.status(404).json({
        success: false,
        message: '',
      });
    }

    // Пока просто храним логин, проверку токена
    // осуществим по exoirationTime и подписи
    const token = await new SignJWT({
      login: user.login,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(session_indays)
      .sign(secret);

    res.cookie('sessionKey', token, {
      maxAge: SESSION_TIME,
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: '',
      profile: {
        ...user,
      },
    });
  } catch (error) {
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
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
}

export { auth };
