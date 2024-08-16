// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user';

// Register a new user
export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role } = req.body;

        // Basic validation
        if (!username || !email || !password || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        user = new User({ username, email, password, role });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        const payload = { user: { id: user.id, role: user.role } };

        // Ensure JWT_SECRET is defined
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        // Sign the token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });
        res.status(201).json({ token });
    } catch (error: any) {
        console.error('Error during registration:', error.message);
        res.status(400).json({ error: error.message });
    }
};
// Login a user
// Login a user
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        console.log('Provided Password:', password);
        console.log('Stored Hash:', user.password);
        console.log('Password Match:', isMatch);

        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        // Ensure JWT_SECRET is defined
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        // Sign the token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 3600 // 1 hour
        });

        // Send the token in the response
        res.status(200).json({ token });
    } catch (error: any) {
        console.error('Error during login:', error.message);
        res.status(500).json({ error: error.message });
    }
};
