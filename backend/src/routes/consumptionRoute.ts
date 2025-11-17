import { Router, Request, Response } from 'express';
import { authMiddleware } from '@middlewares/authMiddleware';
import { validate, validateQuery } from '@middlewares/validateMiddleware';
import { consumptionSchema, consumptionQuerySchema } from '@validation/consumptionSchema';
import { ConsumptionController } from '@controllers/consumptionController';

const router = Router();
const consumptionController = new ConsumptionController();

// Ajouter une consommation
router.post('/add', authMiddleware, validate(consumptionSchema), (req: Request, res: Response) => consumptionController.addConsumption(req, res));
router.get('/all', authMiddleware, validateQuery(consumptionQuerySchema), (req: Request, res: Response) => consumptionController.getAllConsumptions(req, res));

export default router;
