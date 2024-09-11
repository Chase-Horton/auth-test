import z from 'zod';

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, 'Password is required'),
});
export const signupSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, 'Must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Must be at least 8 characters')
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});