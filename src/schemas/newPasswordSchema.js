import z from 'zod';

export const newPasswordSchema = z.object({
    newPassword: z
        .string()
        .min(8, { message: "Password must be atleast of 8 characters" })
        .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]+$/, { message: "Must contain at least one letter, one number, and one special character (!@#$%^&*)" }
        ),
    confirmPassword: z
        .string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});