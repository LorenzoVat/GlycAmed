import { Schema, model } from 'mongoose';

const reportSchema = new Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    avgSugarPerDay: {
      type: Number,
      required: true,
    },
    avgCaffeinePerDay: {
      type: Number,
      required: true,
    },
    daysExceeded: {
      type: Number,
      required: true,
    },
    topProducts: [
      {
        name: String,
        count: Number,
      },
    ],
    topContributors: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        count: Number,
      },
    ],
    score: {
      type: Number,
    },
    trend: {
      type: String,
      enum: ['up', 'down', 'stable'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ReportModel = model('Report', reportSchema);