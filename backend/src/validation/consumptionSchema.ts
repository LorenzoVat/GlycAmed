import { z } from 'zod';

export const consumptionSchema = z.object({
  barcode: z.string().nonempty("Le code-barre est requis"),
  productName: z.string().nonempty("Le nom de produit est requis"),
  quantityMl: z.number({ message: "La quantité doit être un nombre" }).positive('La quantité doit être positive'),
  nutrients: z.object({
    sugar: z.number({ message: "Le sucre doit être un nombre" }).nonnegative('Le sucre ne peut pas être négatif'),
    caffeine: z.number({ message: "La caféine doit être un nombre" }).nonnegative('La caféine ne peut pas être négative'),
    calories: z.number({ message: "Les calories doivent être un nombre" }).nonnegative('Les calories ne peuvent pas être négatives'),
  }),
  location: z.string().optional(),
  notes: z.string().optional(),
  consumedAt: z.string().datetime().optional(),
});

export const consumptionQuerySchema = z.object({
  productName: z.string().optional(),
  contributorId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de contributeur invalide").optional(),
  location: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

export type ConsumptionQueryInput = z.infer<typeof consumptionQuerySchema>;

export type ConsumptionInput = z.infer<typeof consumptionSchema>;
