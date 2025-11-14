import { Router, Request, Response } from 'express';
import {UserController} from '@controllers/userController';
import { authMiddleware } from '@middlewares/authMiddleware';
import { validate } from "@middlewares/validateMiddleware";
import { registerSchema, loginSchema } from "@validation/userSchema";

const router = Router();
const userController = new UserController();

// Création d'un utilisateur
router.post('/register', validate(registerSchema), (req: Request, res: Response) => userController.register(req, res));

// Connexion
router.post('/login', validate(loginSchema), (req: Request, res: Response) => userController.login(req, res));

// Déconnexion
router.post('/logout', (req: Request, res: Response) => userController.logout(req, res));

// Profil
router.get('/me', authMiddleware, (req: Request, res: Response) => userController.getProfile(req, res));
router.put('/me', authMiddleware, (req: Request, res: Response) =>userController.updateProfile(req, res));

// export
export default router;