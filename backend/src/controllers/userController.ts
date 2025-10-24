import { Request, Response } from 'express';
import { UserService } from '@services/userService';
import { RegisterUserDTO, LoginUserDTO } from '@types/userType';
import { generateToken } from '@utils/generateToken';

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const userDto: RegisterUserDTO = req.body;

      const userService = new UserService();
      const user = await userService.register(userDto);

      const token = generateToken(user._id, user.role);

      res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 1000 * 60 * 60 * 24
      })
      .status(201)
      .json({ message: 'User successfully created ', user: { userId: user._id, role: user.role } });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
        const userDto: LoginUserDTO = req.body;

        const userService = new UserService();
        const user = await userService.login(userDto);

        const token = generateToken(user._id, user.role);

        res
        .cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 1000 * 60 * 60 * 24
        })
        .status(201)
        .json({ message: 'User successfully login ', user: { userId: user._id, role: user.role } });
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
        res
        .clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        })
        .status(200)
        .json({ message: 'User successfully logged out' });
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
  }
  

}
