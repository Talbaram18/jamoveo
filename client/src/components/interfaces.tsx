import { Song } from '../types/song';
import { UserRole } from '../types/user';

export interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  error?: string;
}

export interface SignupFormProps {
  onSignup: (userData: {
    username: string;
    password: string;
    instrument?: string;
    role: UserRole;
  }) => void;
  error?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  disabled?: boolean;
}

export interface InputProps {
  label?: string;
  type?: 'text' | 'password' | 'email' | 'select';
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  error?: string;
  options?: Array<{ value: string; label: string }>;
  className?: string;
  required?: boolean;
}

export interface SongDisplayProps {
  song: Song;
  showChords?: boolean;
}

export interface SongMetadata {
  title?: string;
  artist?: string;
  language?: string;
}

export interface SongSearchProps {
  onSearch: (query: string) => void;
}
