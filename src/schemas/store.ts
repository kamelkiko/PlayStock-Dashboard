import { z } from 'zod';
import { codeSchema, nameSchema, descriptionSchema } from './common';

// Schema for the form validation
export const storeSchema = z.object({
    code: codeSchema,
    name: nameSchema,
    logo: z.string().optional().nullable(),
    description: descriptionSchema,
    socialLinks: z.record(z.string(), z.string()).optional().nullable(),
    isActive: z.boolean(),
});

// Schema for the API update request (partial)
export const updateStoreSchema = z.object({
    code: z.string().optional().nullable(),
    name: z.string().min(3).max(50).optional().nullable(),
    logo: z.string().optional().nullable(),
    description: descriptionSchema,
    socialLinks: z.record(z.string(), z.string()).optional().nullable(),
    isActive: z.boolean().optional().nullable(),
});

export type StoreFormData = z.infer<typeof storeSchema>;
export type UpdateStoreFormData = z.infer<typeof updateStoreSchema>;
