import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export class AuthController {
  
  static register = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) return res.status(400).json({ error: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name }
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
      res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
      res.status(500).json({ error: 'Failed to register user' });
    }
  };

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(400).json({ error: 'Invalid credentials' });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(400).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
      res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
      res.status(500).json({ error: 'Failed to login' });
    }
  };
}
