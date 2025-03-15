export enum UserRole {
  PLAYER = 'player',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  instrument?: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserSignup extends UserLogin {
  instrument?: string;
  role: UserRole;
}
