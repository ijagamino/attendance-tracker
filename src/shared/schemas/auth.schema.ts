import { z } from 'zod'
import { createUserSchema } from "./user.schema"

export const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .trim()
    .min(1, 'Password is required')
})

export const registerSchema = createUserSchema.safeExtend({
  confirmPassword: z.string()
}).refine(values => values.password === values.confirmPassword, {
  error: 'Passwords do not match',
  path: ['password']
})
