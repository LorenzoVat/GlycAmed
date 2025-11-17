import { ConsumptionModel } from '@models/Consumption';
import { ConsumptionDTO } from '@types/consumptionType';

export class ConsumptionService {
  async addConsumption(contributorId: string, data: ConsumptionDTO): Promise<void> {
    await ConsumptionModel.create({
      contributorId,
      barcode: data.barcode,
      quantityMl: data.quantityMl,
      nutrients: data.nutrients,
      location: data.location,
      notes: data.notes,
      consumedAt: data.consumedAt,
    });
  }

  async getAllConsumptions() {
    return ConsumptionModel.find()
      .populate('contributorId', 'firstName lastName email')
      .sort({ consumedAt: -1 });
  }
}
