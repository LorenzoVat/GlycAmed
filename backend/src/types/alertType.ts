export interface AlertDTO {
  date: Date;
  type: 'sugar' | 'caffeine' | 'both';
  sugarTotal: number;
  caffeineTotal: number;
  triggeredAt: Date;
}