import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs/promises';
import * as path from 'path';
import { User } from '../types/user';
import { UserRole } from '../types/userRole.ENUM';
/**
 * Authentication Middleware
 * handles all authentication-related functionality including token generation, password hashing, and user validation
 * */

// File path for the user database

const USER_DB_PATH = path.join(__dirname, '../database/users.json');

// Secret key for JWT token signing and verification

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const authMiddleware = {
  // Generate JWT token for authentication
  generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
  },

  // Validate user credentials
  async validateCredentials(
    username: string,
    password: string
  ): Promise<User | null> {
    try {
      // Read users from JSON file
      const usersData = await fs.readFile(USER_DB_PATH, 'utf8');
      const users: User[] = JSON.parse(usersData);

      // Find user by username
      const user = users.find((u) => u.username === username);
      if (!user) return null;

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      return isMatch ? user : null;
    } catch (error) {
      console.error('Credential validation error:', error);
      return null;
    }
  },

  // Check if username is available
  async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const usersData = await fs.readFile(USER_DB_PATH, 'utf8');
      const users: User[] = JSON.parse(usersData);
      return !users.some((u) => u.username === username);
    } catch (error) {
      console.error('Username check error:', error);
      return false;
    }
  },

  //password hashing
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12); //this is for better security
    return bcrypt.hash(password, salt);
  },

  //protect routes with token verification
  requireAuth(requiredRole?: UserRole) {
    return async (req: any, res: any, next: any) => {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as User;

        // Check role if specified
        if (requiredRole && decoded.role !== requiredRole) {
          return res.status(403).json({ message: 'Insufficient permissions' });
        }

        req.user = decoded;
        next();
      } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
    };
  },
};
