import { Router, Request, Response } from 'express';
import { adminMiddleware } from '@middlewares/authMiddleware';
import { AlertController } from '@controllers/alertController';

const router = Router();
const controller = new AlertController();

router.use(adminMiddleware);

// Statistiques quotidiennes
router.get('/recent', (req: Request, res: Response) => controller.getRecentAlerts(req, res));

router.get('/history', (req: Request, res: Response) => controller.getPaginatedAlerts(req, res));

export default router;
