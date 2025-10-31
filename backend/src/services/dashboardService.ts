import { ConsumptionModel } from '@models/Consumption';

export class DashboardService {
  async getDailyStats() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const consumptions = await ConsumptionModel.find({ consumedAt: { $gte: startOfDay } });

    const totals = consumptions.reduce(
      (acc, consumption) => {
        acc.sugar += consumption.nutrients?.sugar ?? 0;
        acc.caffeine += consumption.nutrients?.caffeine ?? 0;
        acc.calories += consumption.nutrients?.calories ?? 0;
        return acc;
      },
      { sugar: 0, caffeine: 0, calories: 0 }
    );

    return {
      ...totals,
      contributions: consumptions.length,
    };
  }
}
