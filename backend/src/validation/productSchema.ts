import { z } from 'zod';

export const productSearchSchema = z.object({
  barcode: z.string().regex(/^[0-9]+$/, 'Le code-barres doit contenir uniquement des chiffres').optional(),
  name: z.string().min(2, 'Le nom du produit doit contenir au moins 2 caractères').optional(),
})
.refine(data => data.barcode || data.name, {
  message: 'Vous devez fournir soit un code-barres, soit un nom de produit',
  path: ['barcode', 'name'],
});

export type ProductSearchInput = z.infer<typeof productSearchSchema>;
