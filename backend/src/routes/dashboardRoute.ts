import { Router, Request, Response } from 'express';
import { authMiddleware } from '@middlewares/authMiddleware';
import { DashboardController } from '@controllers/dashboardController';

const router = Router();
const controller = new DashboardController();

// Statistiques quotidiennes
router.get('/', authMiddleware, (req: Request, res: Response) => controller.getDashboard(req, res));

export default router;
