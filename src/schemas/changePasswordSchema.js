import z from 'zod';
import { signupSchema } from './signupSchema';

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: signupSchema.shape.password,
    confirmPassword: z.string().min(1, { message: "Please confirm your password" })
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match!",
    path: ["confirmPassword"], // Error message confirmPassword field ke niche trigger hoga
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password cannot be the same as current password.",
    path: ["newPassword"],
});