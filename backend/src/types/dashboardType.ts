export interface DashboardTotalsDTO {
  sugar: number;
  caffeine: number;
  calories: number;    
  contributions: number;
}

export interface DashboardDTO {
  totals: DashboardTotalsDTO;
  healthStatus: '✅ Sous les limites' | '⚠️ Limite de sucre dépassée' | '⚠️ Limite de caféine dépassée' | '🚨 Toutes les limites dépassées';
}