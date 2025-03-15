import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middleware/authMiddleware';
import { dbUtils } from '../database/dbUtils';
import { User } from '../types/user';
import { UserRole } from '../types/userRole.ENUM';

const router = express.Router();
/**
 * Authentication
 */
// User Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate credentials
    const user = await authMiddleware.validateCredentials(username, password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Remove sensitive data
    const { password: omit, ...safeUser } = user;

    res.json({
      user: safeUser,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// User Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password, instrument, role } = req.body;

    // Check if username is available
    const isAvailable = await authMiddleware.isUsernameAvailable(username);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check if trying to create an admin account
    if (role === UserRole.ADMIN) {
      // Get all users to check if an admin already exists
      const allUsers = await dbUtils.getUsers();
      const adminExists = allUsers.some((user) => user.role === UserRole.ADMIN);

      if (adminExists) {
        return res.status(400).json({
          message:
            'An admin account already exists. Only one admin account is allowed.',
        });
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
      instrument: instrument || undefined,
    };

    // Save user
    await dbUtils.addUser(newUser);

    // Remove sensitive data
    const { password: omit, ...safeUser } = newUser;

    res.status(201).json({
      user: safeUser,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

export default router;
