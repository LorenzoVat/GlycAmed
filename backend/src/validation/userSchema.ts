import { z } from "zod";
import { UserService } from '@services/userService';

const userService = new UserService();

export const registerSchema = z.object({
  firstName: z.string().nonempty("Le prénom est requis"),
  lastName: z.string().nonempty("Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string()
    .nonempty("Le mot de passe est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
})
.refine(async data => {
  const user = await userService.findUserByEmail(data.email);
  return !user;
}, {
  message: "Un compte avec cet email existe déjà",
  path: ["email"],
});

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().nonempty("Le mot de passe est requis"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;