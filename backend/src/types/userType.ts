export interface RegisterUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface JwtPayloadDTO {
  userId: string;
  role: string;
}


declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayloadDTO;
  }
}