// backend/src/models/User.model.ts
import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'amed'],
      default: 'student',
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model('User', userSchema);