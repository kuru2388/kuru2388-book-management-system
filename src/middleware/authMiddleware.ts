import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Middleware to authenticate user
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Retrieve token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // Check if token exists
  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    // Attach user info to request object
    (req as any).user = decoded;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Token verification failed
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Middleware to authorize admin users
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  // Check if user is an admin
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied, admin only' });
  }

  // Proceed to the next middleware or route handler
  next();
};
