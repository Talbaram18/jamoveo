import { UserSignupDTO } from './types/user';
import { Request } from 'express';

export interface LoginRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

export interface SignupRequest extends Request {
  body: UserSignupDTO;
}
