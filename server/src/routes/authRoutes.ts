import express, { Request, Response, NextFunction } from 'express';
import {
  body,
  validationResult,
  CustomValidator,
  Meta,
} from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middleware/authMiddleware';
import { dbUtils } from '../database/dbUtils';
import { User } from '../types/user';
import { UserRole } from '../types/userRole.ENUM';
import { AppError } from '../middleware/errorHandler';
import { LoginRequest, SignupRequest } from '../interfaces';
/**
 * Authentication Routes
 *
 * */

const router = express.Router();

const instrumentValidator: CustomValidator = (value: any, meta: Meta) => {
  const req = meta.req as Request & { body: { role?: UserRole } };
  //validate instrument if not an admin
  if (req.body.role !== UserRole.ADMIN && !value) {
    throw new Error('Instrument is required for players');
  }

  return true;
};

// Signup input validation
const signupValidation = [
  body('role')
    .optional()
    .isIn([UserRole.PLAYER, UserRole.ADMIN])
    .withMessage('Invalid user role'),
  body('instrument').optional().custom(instrumentValidator),
];

// User Login
router.post(
  '/login',
  // loginValidation,
  async (req: LoginRequest, res: Response, next: NextFunction) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    try {
      const { username, password } = req.body;

      // Validate credentials
      const user = await authMiddleware.validateCredentials(username, password);

      if (!user) {
        return next(new AppError('Invalid credentials', 401));
      }

      // Generate authentication token
      const token = authMiddleware.generateToken(user);

      // Remove sensitive data
      const { password: omit, ...safeUser } = user;

      res.json({
        user: safeUser,
        token,
        message: 'Login successful',
      });
    } catch (error) {
      next(new AppError('Server error during login', 500));
    }
  }
);

// User Signup
router.post(
  '/signup',
  signupValidation,
  async (req: SignupRequest, res: Response, next: NextFunction) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    try {
      const { username, password, instrument, role } = req.body;

      // Check if username is available
      const isAvailable = await authMiddleware.isUsernameAvailable(username);
      if (!isAvailable) {
        return next(new AppError('Username already exists', 400));
      }

      // Check if trying to create an admin account
      if (role === UserRole.ADMIN) {
        // Get all users to check if an admin already exists
        const allUsers = await dbUtils.getUsers();
        const adminExists = allUsers.some(
          (user) => user.role === UserRole.ADMIN
        );

        if (adminExists) {
          return next(new AppError('An admin account already exists', 400));
        }
      }

      // Hash password
      const hashedPassword = await authMiddleware.hashPassword(password);

      // Create new user
      const newUser: User = {
        id: uuidv4(),
        username,
        password: hashedPassword,
        role: role || UserRole.PLAYER,
        instrument: role === UserRole.ADMIN ? undefined : instrument,
      };

      // Save user
      await dbUtils.addUser(newUser);

      // Generate authentication token
      const token = authMiddleware.generateToken(newUser);

      // Remove sensitive data
      const { password: omit, ...safeUser } = newUser;

      res.status(201).json({
        user: safeUser,
        token,
        message: 'User created successfully',
      });
    } catch (error) {
      next(new AppError('Server error during signup', 500));
    }
  }
);

export default router;
