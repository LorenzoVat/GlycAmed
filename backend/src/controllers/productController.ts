import { Request, Response } from 'express';
import { ProductService } from '@services/productService';
import { SearchDTO } from '@types/productType';

export class ProductController {
  private readonly productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  // Search by name or barcode
  async search(req: Request, res: Response) {
    try {
      const { barcode, name } = req.query as SearchDTO;

      if (!barcode && !name) {
        return res.status(400).json({ error: 'Vous devez fournir un code-barres ou un nom de produit' });
      }

      const products = await this.productService.searchProduct({ barcode, name });
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
