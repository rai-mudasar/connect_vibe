import z from 'zod';

export const signupSchema = z.object({
    username: z
    .string()
    .min(3, {message: "Username must containt atleast 3 character"})
    .max(20, {message: "Username shoulder never large than 20 character"})
    .regex(/^[a-zA-Z0-9_]+$/, {message: "Username must not contain special characters"}),

    email: z.email({ message: "Invalid email address" }),

    password: z
    .string()
    .min(8, { message: "Password must be atleast of 8 characters" })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]+$/,{ message: "Must contain at least one letter, one number, and one special character (!@#$%^&*)" }
)
});