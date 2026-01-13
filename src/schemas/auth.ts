import { z } from 'zod';
import { usernameSchema, passwordSchema } from './common';

export const loginSchema = z.object({
    username: usernameSchema,
    password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
