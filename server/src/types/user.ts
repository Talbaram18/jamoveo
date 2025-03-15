import { UserRole } from './userRole.ENUM';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  instrument?: string;
}

export interface UserLoginDTO {
  username: string;
  password: string;
}

export interface UserSignupDTO extends UserLoginDTO {
  instrument?: string;
  role: UserRole;
}
