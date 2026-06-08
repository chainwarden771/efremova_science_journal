import { jwtVerify, decodeJwt, errors as JoseErros } from 'jose';

// ============================
// Пользовательские импорты
// ============================

import { findByLogin } from '../services/UserService.js';

// ============================
// Окружение
// ============================

const secret = new TextEncoder().encode(process.env.JWT_SIGN_KEY || 'Sx02Ks');

export async function verifySession(req, res, next) {
  try {
    await jwtVerify(req.cookies.sessionKey, secret);
    const jwtPayload = await decodeJwt(req.cookies.sessionKey, secret);
    const dbUser = await findByLogin(jwtPayload.login);

    if (!dbUser) {
      throw new Error('Not found');
    }

    next();
  } catch (error) {
    res.clearCookie('sessionKey');
    if (error instanceof JoseErros.JWTExpired) {
      res.status(401).json({
        success: false,
        error: 'Session expired error',
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Session error',
      });
    }
    console.error('Verify Session Error:', error);
  }
}
