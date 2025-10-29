import { ConsumptionModel } from '@models/Consumption';
import { ConsumptionDTO } from '@types/consumptionType';

export class ConsumptionService {
  async addConsumption(contributorId: string, data: ConsumptionDTO) {
    const consumption = await ConsumptionModel.create({
      contributorId,
      barcode: data.barcode,
      quantityMl: data.quantityMl,
      nutrients: data.nutrients,
      location: data.location,
      notes: data.notes,
      consumedAt: data.consumedAt,
    });

    return consumption;
  }

  async getAllConsumptions() {
    return ConsumptionModel.find()
      .populate('contributorId', 'firstName lastName email')
      .sort({ consumedAt: -1 });
  }
}
