import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { JwtPayloadDTO } from '@types/userType';
import { ObjectId } from "mongoose";

/**
 * Génère un JWT pour un utilisateur donné
 * @param userId - ID de l'utilisateur
 * @param role - rôle de l'utilisateur (student | amed)
 * @returns token JWT signé
 */
export const generateToken = (userId: ObjectId, role: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET not defined");
  }

  const secretKey: Secret = secret;

  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  };

  const payload: JwtPayloadDTO = { userId, role };

  return jwt.sign(payload, secretKey, options);
};
