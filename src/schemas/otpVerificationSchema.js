import z from 'zod';


export const otpVerificationSchema = z.object({
    code: z
    .string()
    .min(6, "Otp should be of 6 digits")
    .max(6, "Otp should be of 6 digits")
})