import { z } from 'zod';
import { priceSchemaOptional, descriptionSchema } from './common';

export const gamePriceSchema = z.object({
    priceFull: priceSchemaOptional,
    pricePrimaryPs4: priceSchemaOptional,
    pricePrimaryPs5: priceSchemaOptional,
    priceSecondary: priceSchemaOptional,
    priceOffline: priceSchemaOptional,
    isActive: z.boolean().optional().nullable(),
    notes: descriptionSchema,
});

export type GamePriceFormData = z.infer<typeof gamePriceSchema>;
