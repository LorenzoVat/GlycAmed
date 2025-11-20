import { ConsumptionModel } from '@models/Consumption';
import { ConsumptionDTO, ConsumptionFilters, ConsumptionQuery } from '@types/consumptionType';

export class ConsumptionService {
  async addConsumption(contributorId: string, data: ConsumptionDTO): Promise<void> {
    await ConsumptionModel.create({
      contributorId,
      barcode: data.barcode,
      productName: data.productName,
      quantityMl: data.quantityMl,
      nutrients: data.nutrients,
      location: data.location,
      notes: data.notes,
      consumedAt: data.consumedAt,
    });
  }

  async getAllConsumptions(filters: ConsumptionFilters) {
    const query: ConsumptionQuery = {};

    if (filters.productName) {
      query.productName = { $regex: filters.productName, $options: 'i' };
    }
    if (filters.contributorId) {
      query.contributorId = filters.contributorId;
    }
    if (filters.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }
    if (filters.dateFrom || filters.dateTo) {
      query.consumedAt = {};
      if (filters.dateFrom) query.consumedAt.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) query.consumedAt.$lte = new Date(filters.dateTo);
    }

    return ConsumptionModel.find(query)
      .populate('contributorId', 'firstName lastName email')
      .sort({ consumedAt: -1 });
  }

  async deleteConsumption(userId: string, consumptionId: string) {
    return ConsumptionModel.findOneAndDelete({
      _id: consumptionId,
      contributorId: userId,
    });
  }

}
