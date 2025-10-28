import { Router, Request, Response } from 'express';
import { ProductController } from '@controllers/productController';
import { validate, validateQuery } from "@middlewares/validateMiddleware";
import { productSearchSchema } from "@validation/productSchema";

const router = Router();
const productController = new ProductController();

// recherche d'un produit
router.get('/search', validateQuery(productSearchSchema), (req: Request, res: Response) => productController.search(req, res));

export default router;
