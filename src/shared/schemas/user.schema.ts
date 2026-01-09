import { z } from 'zod'

const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

export const createUserSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .trim()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercaste letter')
    .regex(/\d/, 'Password must contain at least one digit letter')
    .regex(specialCharRegex, "Password must contain at least one special character")
  ,
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required')
})

export const updateUserSchema = z.object({
  email: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string()
})
