import { AlertModel } from '@models/Alert';
import { healthOMSFlag } from '@types/dashboardType';
import { AlertDTO } from '@types/alertType';

export class AlertService {
    async createOrUpdateAlert(totalSugar: number, totalCaffeine: number, status: healthOMSFlag): Promise<void> {
        
        if (!status.isSugarOverLimit  && !status.isCaffeineOverLimit) return;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);


        let type: 'both' | 'sugar' | 'caffeine';

        if (status.isSugarOverLimit && status.isCaffeineOverLimit) {
            type = 'both';
        } else if (status.isSugarOverLimit) {
            type = 'sugar';
        } else {
            type = 'caffeine';
        }
        
        const existingAlert = await AlertModel.findOne({ date: today });

        if (existingAlert) {
            existingAlert.type = type;
            existingAlert.sugarTotal = totalSugar;
            existingAlert.caffeineTotal = totalCaffeine;
            existingAlert.triggeredAt = new Date();
            await existingAlert.save();
        } else {
            await AlertModel.create({
            date: today,
            type,
            sugarTotal: totalSugar,
            caffeineTotal: totalCaffeine,
            });
        }
    }

    async getConsecutiveOverLimitDays(): Promise<number> {
        const alerts = await AlertModel.find().sort({ date: -1 });
        let count = 0;
        for (const alert of alerts) {
            if (!alert) break;
            count++;
        }
        return count;
    }

    async getRecentAlerts(limit = 5): Promise<AlertDTO[]> {
        const alerts = await AlertModel.find().sort({ date: -1 }).limit(limit);
        return alerts.map(({ date, type, sugarTotal, caffeineTotal, triggeredAt }) => ({
            date,
            type,
            sugarTotal,
            caffeineTotal,
            triggeredAt,
        }));
    }

    async getPaginatedAlerts(page = 1, limit = 10): Promise<AlertDTO[]> {
        const skip = (page - 1) * limit;
        const alerts = await AlertModel.find().sort({ date: -1 }).skip(skip).limit(limit);
        return alerts.map(({ date, type, sugarTotal, caffeineTotal, triggeredAt }) => ({
            date,
            type,
            sugarTotal,
            caffeineTotal,
            triggeredAt,
        }));
    }
}