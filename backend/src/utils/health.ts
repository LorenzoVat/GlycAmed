import { healthOMSFlag } from '@types/dashboardType';

export const OMS_LIMITS = {
  sugar: 50,
  caffeine: 400,
};

export function getHealthFlags(totalSugar: number, totalCaffeine: number): healthOMSFlag {
  return {
    isSugarOverLimit: totalSugar > OMS_LIMITS.sugar,
    isCaffeineOverLimit: totalCaffeine > OMS_LIMITS.caffeine,
  };  
}


