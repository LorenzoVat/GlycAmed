import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { JwtPayloadDTO } from '@types/userType';
import { Types  } from "mongoose";

/**
 * Génère un JWT pour un utilisateur donné
 * @param userId - ID de l'utilisateur
 * @returns token JWT signé
 */
export const generateToken = (userId: Types.ObjectId): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET not defined");
  }

  const secretKey: Secret = secret;

  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  };

  const payload: JwtPayloadDTO = { userId: userId.toString() };

  return jwt.sign(payload, secretKey, options);
};
