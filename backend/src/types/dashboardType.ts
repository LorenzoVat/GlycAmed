export interface DashboardTotalsDTO {
  sugar: number;
  caffeine: number;
  calories: number;    
  contributions: number;
}

export interface healthOMSFlag {
    isSugarOverLimit: boolean;
    isCaffeineOverLimit: boolean;
}

export interface DashboardDTO {
  totals: DashboardTotalsDTO;
  healthStatus: healthOMSFlag
}