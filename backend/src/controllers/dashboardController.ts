import { Request, Response } from 'express';
import { DashboardService } from '@services/dashboardService';
import { DashboardDTO } from '@types/dashboardType';
import { getHealthOMSStatus } from '@utils/health';

const dashboardService = new DashboardService();

export class DashboardController {
  async getDashboard(req: Request, res: Response) {
    try {
      const stats = await dashboardService.getDailyStats();
      const status = getHealthOMSStatus(stats.sugar, stats.caffeine);

      const response: DashboardDTO = {      
        totals: {
          sugar: stats.sugar,
          caffeine: stats.caffeine,
          calories: stats.calories,
          contributions: stats.contributions,
        },
        healthStatus: status,
      };

      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
