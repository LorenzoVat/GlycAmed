export interface ConsumptionDTO {
  barcode: string;
  productName: string;
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

export interface ConsumptionFilters {
  productName?: string;
  contributorId?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ConsumptionQuery {
  productName?: { $regex: string; $options: string };
  contributorId?: string;
  location?: { $regex: string; $options: string };
  consumedAt?: { $gte?: Date; $lte?: Date };
}


