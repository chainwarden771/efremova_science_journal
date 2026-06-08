import { z } from 'zod';

// Определяем схему для данных регистрации
const registerSchema = z.object({
  fullname: z.string().min(2, { message: 'Full name must be at least 2 characters long' }).max(45),
  login: z.string().min(3, { message: 'Login must be at least 3 characters long' }).max(45),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).max(45),
  gender: z.enum(['m', 'f'], { message: "Gender must be 'm' or 'f'" }),
  role: z.enum(['r', 'p'], { message: "role must be 'r' or 'p'" }),
});

// Определяем схему авторизации
const authSchema = z.object({
  login: z.string().min(3, { message: 'Login must be at least 3 characters long' }).max(45),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).max(45),
});

// Определяем схему публикации
const publishSchema = z.object({
  title: z.string().min(3, { message: 'Login must be at least 3 characters long' }).max(45),
  description: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(750),
});

export { registerSchema, authSchema, publishSchema };
