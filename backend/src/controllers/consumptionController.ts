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
      const consumptions = await this.consumptionService.getAllConsumptions();
      res.status(200).json(consumptions);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
};
