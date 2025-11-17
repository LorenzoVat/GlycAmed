import { Request, Response } from 'express';
import { DashboardService } from '@services/dashboardService';
import { AlertService } from '@services/alertService';
import { DashboardDTO } from '@types/dashboardType';
import { getHealthFlags } from '@utils/health';

export class DashboardController {
  private readonly dashboardService: DashboardService;
  private readonly alertService: AlertService;

  constructor() {
    this.dashboardService = new DashboardService();
    this.alertService = new AlertService();
  }

  async getDashboard(req: Request, res: Response) {
    try {
      const stats = await this.dashboardService.getDailyStats();
      const status = getHealthFlags(stats.sugar, stats.caffeine);
      await this.alertService.createOrUpdateAlert(stats.sugar, stats.caffeine, status);

      const response: DashboardDTO = {      
        totals: {
          sugar: stats.sugar,
          caffeine: stats.caffeine,
          calories: stats.calories,
          contributions: stats.contributions,
        },
        healthStatus: status
      };

      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
