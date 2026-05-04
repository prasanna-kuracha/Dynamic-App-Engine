import type { Request, Response } from 'express';
import { ConfigService } from '../services/ConfigService.js';
import prisma from '../lib/prisma.js';

const configService = new ConfigService();

export class DynamicController {
  
  static getAll = async (req: Request, res: Response) => {
    const { modelName } = req.params;
    if (!modelName) return res.status(400).json({ error: 'Model name is required' });

    const config = configService.getConfig();
    const model = config.models.find((m: any) => m.name.toLowerCase() === (modelName as string).toLowerCase());

    if (!model) {
      return res.status(404).json({ error: `Model ${modelName} not found` });
    }

    try {
      const records = await prisma.dynamicRecord.findMany({
        where: { modelName: model.name }
      });
      
      // Flatten the data blob for the frontend
      const data = records.map((r: any) => ({
        id: r.id,
        ...(r.data as object),
        createdAt: r.createdAt
      }));
      
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data from database' });
    }
  };

  static create = async (req: Request, res: Response) => {
    const { modelName } = req.params;
    if (!modelName) return res.status(400).json({ error: 'Model name is required' });

    const config = configService.getConfig();
    const model = config.models.find((m: any) => m.name.toLowerCase() === (modelName as string).toLowerCase());

    if (!model) {
      return res.status(404).json({ error: `Model ${modelName} not found` });
    }

    try {
      const newRecord = await prisma.dynamicRecord.create({
        data: {
          modelName: model.name,
          data: req.body
        }
      });
      
      res.status(201).json({
        id: newRecord.id,
        ...(newRecord.data as object),
        createdAt: newRecord.createdAt
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save data to database' });
    }
  };

  static getConfig = (req: Request, res: Response) => {
    try {
      const config = configService.getConfig();
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load config' });
    }
  };
}
