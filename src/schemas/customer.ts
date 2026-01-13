import { z } from 'zod';
import {
    codeSchema,
    nameSchema,
    phoneSchemaOptional,
    emailSchemaOptional,
    descriptionSchema,
} from './common';

export const customerSchema = z.object({
    name: nameSchema,
    code: codeSchema,
    phone: phoneSchemaOptional,
    email: emailSchemaOptional,
    notes: descriptionSchema,
});

export const updateCustomerSchema = z.object({
    name: z.string().min(3).max(50).optional().nullable(),
    code: z.string().optional().nullable(),
    phone: phoneSchemaOptional,
    email: emailSchemaOptional,
    notes: descriptionSchema,
});

export type CustomerFormData = z.infer<typeof customerSchema>;
export type UpdateCustomerFormData = z.infer<typeof updateCustomerSchema>;
