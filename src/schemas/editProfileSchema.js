import z from "zod";

const englishLettersOnly = /^[A-Za-z]+$/; // Allows A-Z, a-z (no spaces/numbers)
const noRepeatedChars = /^(?!.*(.)\1{2,}).*$/; // Rejects 3+ consecutive identical characters (e.g., "aaa", "hhhh")

export const editProfileSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, { message: "First name must be at least 2 characters" })
        .max(10, { message: "First name must not exceed 10 characters" })
        .regex(englishLettersOnly, { message: "First name can only contain English alphabets" })
        .regex(noRepeatedChars, { message: "First name cannot contain repetitive characters (e.g. 'aaa')" }),

    lastName: z
        .string()
        .trim()
        .min(2, { message: "Last name must be at least 2 characters" })
        .max(10, { message: "Last name must not exceed 10 characters" })
        .regex(englishLettersOnly, { message: "Last name can only contain English alphabets" })
        .regex(noRepeatedChars, { message: "Last name cannot contain repetitive characters (e.g. 'aaa')" }),

    bio: z
        .string()
        .trim()
        .min(1, { message: "Bio should never be empty" })
        .max(100, { message: "Bio should not exceed 100 characters" }),

    location: z
        .string()
        .trim()
        .min(2, { message: "Location must be at least 2 characters" })
        .max(15, { message: "Location must not exceed 15 characters" }),

    occupation: z
        .string()
        .trim()
        .min(2, { message: "Occupation must be at least 2 characters" })
        .max(15, { message: "Occupation must not exceed 15 characters" }),

    relationshipStatus: z.enum(
        ["none", "Single", "Married", "Engaged", "In a relationship"],
        { message: "Please select a valid relationship status" }
    )
});