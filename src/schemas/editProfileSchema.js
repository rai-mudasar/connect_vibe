import z from "zod";

export const editProfileSchema = z.object({
    firstName: z
    .string()
    .min(2, {message: "First name should no less than 2 Character"})
    .max(10, {message: "First name should no greater than 10 character"}),
    
    lastName: z
    .string()
    .min(2, {message: "Last name should no less than 2 Character"})
    .max(10, {message: "Last name should no greater than 10 character"}),

    bio: z
    .string()
    .min(1, {message: "Bio should never be empty"})
    .max(100, {message: "Bio should no greater than 100 character"}),

    location: z
    .string()
    .min(2, {message: "location should no less than 2 Character"})
    .max(15, {message: "location should no greater than 15 character"}),

    occupation: z
    .string()
    .min(2, {message: "Occupation should no less than 2 Character"})
    .max(15, {message: "Occupation should no greater than 15 character"}),

    relationshipStatus: z
    .enum(["none", "Single", "Married", "Engaged", "In a relationship"])
})