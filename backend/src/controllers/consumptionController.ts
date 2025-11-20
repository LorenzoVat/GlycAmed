import { Request, Response } from 'express';
import { ConsumptionService } from '@services/consumptionService';


export class ConsumptionController {
  private readonly consumptionService: ConsumptionService;
  
  constructor() {
    this.consumptionService = new ConsumptionService();
  }
  
  async addConsumption(req: Request, res: Response) {
    try {
      const contributorId = req.user!.userId;
      await this.consumptionService.addConsumption(contributorId, req.body);
      return res.status(201).json({message: 'Consumption successfully created'});
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  async getAllConsumptions(req: Request, res: Response) {
    try {
      const filters = req.query;
      const consumptions = await this.consumptionService.getAllConsumptions(filters);
      res.status(200).json(consumptions);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  async deleteConsumption(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const consumptionId = req.params.id;
      const deleted = await this.consumptionService.deleteConsumption(userId, consumptionId);

      if (!deleted) {
        return res.status(404).json({ message: 'Consumption not found or not authorized' });
      }

      return res.status(200).json({ message: 'Consumption successfully deleted' });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }
};
