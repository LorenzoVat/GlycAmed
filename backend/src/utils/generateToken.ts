import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { JwtPayloadDTO } from '@types/userType';
import { Types  } from "mongoose";

/**
 * Génère un JWT pour un utilisateur donné
 * @param userId - ID de l'utilisateur
 * @param role - rôle de l'utilisateur (student | amed)
 * @returns token JWT signé
 */
export const generateToken = (userId: Types.ObjectId, role: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET not defined");
  }

  const secretKey: Secret = secret;

  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  };

  const payload: JwtPayloadDTO = { userId: userId.toString(), role };

  return jwt.sign(payload, secretKey, options);
};
