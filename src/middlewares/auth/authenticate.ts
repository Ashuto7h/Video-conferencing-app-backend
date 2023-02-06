/* eslint-disable require-atomic-updates */
import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { responseHandler } from '../../utils/responseHandler';
import { User } from '../../models/user';
import config from '../../configs/index';
import { NextFunction, Request, Response } from 'express';

dotenv.config();

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || '';
    const decoded = verify(token, config.jwtSecret) as { _id: string };
    const user = await User.findOne({
      _id: decoded._id,
    }).exec();
    if (!user) {
      return responseHandler(req, res, 404, '');
    }
    req.token = token;
    req.user = user;
    return next();
  } catch (error) {
    return responseHandler(req, res, 401, '');
  }
};
