import { Request, Response, NextFunction } from 'express';

const asyncMid = (fn: (req: Request, res: Response) => Promise<any>) => (
  req: Request,
  res: Response,
  next: NextFunction
) => fn(req, res).catch(error => next(error));

export default asyncMid;
