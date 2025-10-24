import { ZodObject } from "zod";
import type { ZodRawShape } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodObject<ZodRawShape>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        message: "Erreur de validation",
         errors: error.issues[0]
      });
    }
  };