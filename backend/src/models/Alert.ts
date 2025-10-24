import { Schema, model } from 'mongoose';

const alertSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ['sugar', 'caffeine', 'both'],
    required: true,
  },
  sugarTotal: {
    type: Number,
    required: true,
  },
  caffeineTotal: {
    type: Number,
    required: true,
  },
  triggeredAt: {
    type: Date,
    default: Date.now,
  },
});

export const AlertModel = model('Alert', alertSchema);