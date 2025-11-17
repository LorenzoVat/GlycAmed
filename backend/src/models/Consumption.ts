import { Schema, model } from 'mongoose';

const consumptionSchema = new Schema(
  {
    contributorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    barcode: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    quantityMl: {
      type: Number,
      required: true,
    },
    nutrients: {
      sugar: { type: Number, required: true },
      caffeine: { type: Number, required: true },
      calories: { type: Number, required: true },
    },
    location: {
      type: String,
    },
    notes: {
      type: String,
    },
    consumedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const ConsumptionModel = model('Consumption', consumptionSchema);