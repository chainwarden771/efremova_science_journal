import express from 'express';

import { register } from './register.js';
import { auth } from './auth.js';
import { check } from './check.js';
import { logout } from './logout.js';

// ============================
// Сесионный роутер
// ============================

const sessionRouter = express.Router();

sessionRouter.post('/register', register);
sessionRouter.post('/auth', auth);
sessionRouter.post('/status', check);
sessionRouter.post('/logout', logout);

export { sessionRouter };
