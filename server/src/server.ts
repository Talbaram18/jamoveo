import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import songRoutes from './routes/songRoutes';
import { configureSocket } from './config/socketConfig';
import { errorHandler } from './middleware/errorHandler';
/*
 *The SERVER ITSELF
 */

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Security and parsing middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use(express.static(path.join(__dirname, '../../client/build')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);

// handler for React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

// Global error handler
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.IO
const io = configureSocket(server);

// Attach io to the server
(server as any).io = io;

// port config
const PORT = process.env.PORT || 5000;

// Start
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

//  shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

//other errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
