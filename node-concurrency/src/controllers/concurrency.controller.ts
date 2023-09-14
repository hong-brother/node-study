import { NextFunction, Request, Response } from 'express';

export class ConcurrencyController {
  public generateId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201);
    } catch (e) {
      next(e);
    }
  };
}
