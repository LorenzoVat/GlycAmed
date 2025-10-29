import { JwtPayloadDTO } from '@types/userType';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadDTO;
    }
  }
}

export {};