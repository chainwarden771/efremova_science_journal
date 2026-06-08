import { z } from 'zod';
import { MongoServerError } from 'mongodb';
import { SignJWT } from 'jose';

// ============================
// Пользовательские импорты
// ============================

import { createUser } from '../../services/UserService.js';
import { registerSchema } from '../../validation/zod/session.js';

// ============================
// Окружение
// ============================

const SESSION_TIME = Number(process.env.SESSION_TIME) || 86400000;
const session_indays = `${SESSION_TIME / 86400000}d`;
const secret = new TextEncoder().encode(process.env.JWT_SIGN_KEY || 'Sx02Ks');

async function register(req, res) {
  try {
    const validatedData = registerSchema.parse(req.body.credentials);
    await createUser(validatedData);

    // Пока просто храним логин, проверку токена
    // осуществим по exoirationTime и подписи
    const token = await new SignJWT({
      login: validatedData.login,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(session_indays)
      .sign(secret);

    res.cookie('sessionKey', token, {
      maxAge: SESSION_TIME,
      httpOnly: true,
    });

    res.status(201).json({
      success: true,
      message: '',
      profile: {
        ...validatedData,
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
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
}

export { register };
