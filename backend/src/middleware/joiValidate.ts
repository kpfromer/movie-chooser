import joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const joiValidate = (schema: joi.SchemaLike) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  joi
    .validate(req.body, schema)
    .then(updatedBody => {
      req.body = updatedBody;
      next();
    })
    .catch(error => {
      next(error);
    });
};
