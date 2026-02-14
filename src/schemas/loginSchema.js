import z from 'zod';

export const loginSchema = z.object({

    identifier: z.string(),

    password: z
    .string()
    .min(8, { message: "Password must be atleast of 8 characters" })
});