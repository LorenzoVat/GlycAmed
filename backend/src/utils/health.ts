export type HealthStatus =
  | '✅ Sous les limites'
  | '⚠️ Limite de sucre dépassée'
  | '⚠️ Limite de caféine dépassée'
  | '🚨 Toutes les limites dépassées';

export const OMS_LIMITS = {
  sugar: 50,
  caffeine: 400,
};

export function getHealthOMSStatus(totalSugar: number, totalCaffeine: number): HealthStatus {
  if (totalSugar > OMS_LIMITS.sugar && totalCaffeine > OMS_LIMITS.caffeine)
    return '🚨 Toutes les limites dépassées';
  if (totalSugar > OMS_LIMITS.sugar)
    return '⚠️ Limite de sucre dépassée';
  if (totalCaffeine > OMS_LIMITS.caffeine)
    return '⚠️ Limite de caféine dépassée';
  return '✅ Sous les limites';
}
