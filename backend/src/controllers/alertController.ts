import { Request, Response } from 'express';
import { AlertService } from '@services/alertService';

export class AlertController {
    private readonly alertService: AlertService;

    constructor() {
        this.alertService = new AlertService();
    }

    async getRecentAlerts(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 5;
            const alerts = await this.alertService.getRecentAlerts(limit);
            res.status(200).json(alerts);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getPaginatedAlerts(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const alerts = await this.alertService.getPaginatedAlerts(page, 10);
            res.status(200).json(alerts);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
