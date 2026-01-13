import { z } from 'zod';
import {
    codeSchema,
    nameSchema,
    addressSchemaOptional,
    validationPatterns,
} from './common';

const outletTypeSchema = z.enum(['PHYSICAL', 'ONLINE']);

// Egyptian phone list validator
const egyptianPhonesSchema = z
    .array(z.string().regex(validationPatterns.egyptianPhone))
    .optional()
    .nullable();

// WhatsApp links validator
const whatsAppLinksSchema = z
    .array(z.string().regex(validationPatterns.whatsAppLink))
    .optional()
    .nullable();

export const outletSchema = z.object({
    code: codeSchema,
    name: nameSchema,
    type: outletTypeSchema,
    address: addressSchemaOptional,
    googleMapsUrl: z.string().url().optional().or(z.literal('')),
    phones: egyptianPhonesSchema,
    whatsApps: whatsAppLinksSchema,
});

export const updateOutletSchema = z.object({
    code: z.string().optional().nullable(),
    name: z.string().min(3).max(50).optional().nullable(),
    type: outletTypeSchema.optional().nullable(),
    address: addressSchemaOptional,
    googleMapsUrl: z.string().url().optional().or(z.literal('')).nullable(),
    phones: egyptianPhonesSchema,
    whatsApps: whatsAppLinksSchema,
    isActive: z.boolean().optional().nullable(),
});

export type OutletFormData = z.infer<typeof outletSchema>;
export type UpdateOutletFormData = z.infer<typeof updateOutletSchema>;
