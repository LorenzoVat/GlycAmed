export interface ConsumptionDTO {
  barcode: string;
  quantityMl: number;
  nutrients: {
    sugar: number;
    caffeine: number;
    calories: number;
  };
  location?: string;
  notes?: string;
  consumedAt?: string;
}
