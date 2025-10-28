import { ZodObject, ZodSchema,  infer as zInfer} from "zod";
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

export const validateQuery = (schema: ZodObject<ZodRawShape>) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.query);
      Object.assign(req.query, validated);
      next();
    } catch (error: any) {
      return res.status(400).json({
        message: `Erreur de validation des paramètres`,
        errors: error.issues,
      });
    }
  };