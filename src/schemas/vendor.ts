import { z } from 'zod';
import { codeSchema, nameSchema, phoneSchemaOptional, descriptionSchema } from './common';

export const vendorSchema = z.object({
    name: nameSchema,
    code: codeSchema,
    phone: phoneSchemaOptional,
    notes: descriptionSchema,
});

export const updateVendorSchema = z.object({
    name: z.string().min(3).max(50).optional().nullable(),
    code: z.string().optional().nullable(),
    phone: phoneSchemaOptional,
    notes: descriptionSchema,
});

export type VendorFormData = z.infer<typeof vendorSchema>;
export type UpdateVendorFormData = z.infer<typeof updateVendorSchema>;
