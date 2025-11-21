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
router.delete('/delete/:id', authMiddleware, (req: Request, res: Response) => consumptionController.deleteConsumption(req, res));
router.put('/update/:id', authMiddleware, validate(consumptionSchema), (req: Request, res: Response) => consumptionController.updateConsumption(req, res));

export default router;
