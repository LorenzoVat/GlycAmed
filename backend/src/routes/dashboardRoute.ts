import { Router, Request, Response } from 'express';
import { adminMiddleware } from '@middlewares/authMiddleware';
import { DashboardController } from '@controllers/dashboardController';

const router = Router();
const controller = new DashboardController();

router.use(adminMiddleware);

// Statistiques quotidiennes
router.get('/', (req: Request, res: Response) => controller.getDashboard(req, res));

export default router;
