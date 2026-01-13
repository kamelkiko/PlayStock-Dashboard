import { z } from 'zod';

// Common validation patterns matching Kotlin backend
export const validationPatterns = {
    code: /^[a-zA-Z0-9\-_]{3,50}$/,
    username: /^[a-zA-Z0-9_]{3,20}$/,
    email: /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    egyptianPhone: /^01[0125][0-9]{8}$/,
    whatsAppLink: /^(https?:\/\/)?(wa\.me|api\.whatsapp\.com)\/.*$/,
    outletType: /^(PHYSICAL|ONLINE)$/,
    platform: /^(PS4|PS5)$/,
};

// Validation message keys (matching backend i18n keys)
export const validationMessages = {
    required: 'validation.required',
    code: 'validation.invalid.code',
    username: 'validation.invalid.username',
    email: 'validation.invalid.email',
    phone: 'validation.invalid.phone',
    password: {
        tooShort: 'validation.invalid.password.too_short',
    },
    name: {
        tooShort: 'validation.invalid.name.too_short',
        tooLong: 'validation.invalid.name.too_long',
    },
    notes: {
        tooShort: 'validation.invalid.notes.too_short',
        tooLong: 'validation.invalid.notes.too_long',
    },
    address: {
        size: 'validation.invalid.address_size',
    },
    price: 'validation.invalid.price',
};

// Reusable validators
export const codeSchema = z
    .string()
    .min(1, { message: validationMessages.required })
    .regex(validationPatterns.code, { message: validationMessages.code });

export const codeSchemaOptional = z
    .string()
    .regex(validationPatterns.code, { message: validationMessages.code })
    .optional()
    .or(z.literal(''));

export const nameSchema = z
    .string()
    .min(1, { message: validationMessages.required })
    .min(3, { message: validationMessages.name.tooShort })
    .max(50, { message: validationMessages.name.tooLong });

export const nameSchemaOptional = z
    .string()
    .min(3, { message: validationMessages.name.tooShort })
    .max(50, { message: validationMessages.name.tooLong })
    .optional()
    .or(z.literal(''));

export const descriptionSchema = z
    .string()
    .min(3, { message: validationMessages.notes.tooShort })
    .max(255, { message: validationMessages.notes.tooLong })
    .optional()
    .or(z.literal(''));

export const usernameSchema = z
    .string()
    .min(1, { message: validationMessages.required })
    .regex(validationPatterns.username, { message: validationMessages.username });

export const passwordSchema = z
    .string()
    .min(1, { message: validationMessages.required })
    .min(8, { message: validationMessages.password.tooShort });

export const emailSchemaOptional = z
    .string()
    .regex(validationPatterns.email, { message: validationMessages.email })
    .optional()
    .or(z.literal(''));

export const phoneSchemaOptional = z
    .string()
    .regex(validationPatterns.egyptianPhone, { message: validationMessages.phone })
    .optional()
    .or(z.literal(''));

export const priceSchemaOptional = z
    .number()
    .min(0, { message: validationMessages.price })
    .max(10000, { message: validationMessages.price })
    .optional()
    .nullable();

export const addressSchemaOptional = z
    .string()
    .min(40, { message: validationMessages.address.size })
    .max(255, { message: validationMessages.address.size })
    .optional()
    .or(z.literal(''));
