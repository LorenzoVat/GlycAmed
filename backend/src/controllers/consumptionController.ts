import { Request, Response } from 'express';
import { ConsumptionService } from '@services/consumptionService';

const service = new ConsumptionService();

export class ConsumptionController {
  async addConsumption(req: Request, res: Response) {
    try {
      const contributorId = req.user!.userId;
      const consumption = await service.addConsumption(contributorId, req.body);
      return res.status(201).json(consumption);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  async getAllConsumptions(req: Request, res: Response) {
    try {
      const consumptions = await service.getAllConsumptions();
      res.status(200).json(consumptions);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
};
