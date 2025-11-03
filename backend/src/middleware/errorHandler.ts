import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  Logger.error('Unhandled error', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};
