import bcrypt from 'bcrypt';
import session from 'express-session';
import type { Express, RequestHandler } from 'express';
import { storage } from './storage';

declare module 'express-session' {
  interface SessionData {
    isAuthenticated?: boolean;
    userId?: number;
    isAdmin?: boolean;
  }
}

export function setupSession(app: Express) {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'journal-secret-key-2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
}

export const requireAuth: RequestHandler = async (req, res, next) => {
  if (!req.session.isAuthenticated || !req.session.isAdmin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // This middleware just adds auth info to request, doesn't block
  (req as any).isAuth = req.session.isAuthenticated || false;
  (req as any).isAdminUser = req.session.isAdmin || false;
  next();
};

// Hash password utility
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify password utility
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}