import { verify } from 'jsonwebtoken';
import { responseHandler } from '../../utils/responseHandler';
import { User } from '../../models/user';
import config from '../../configs/index';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = verify(token, config.jwtSecret);
    const user = await User.findOne({
      _id: decoded._id,
    });

    if (!user) {
      responseHandler(req, res, 404);
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    responseHandler(req, res, 401);
  }
};
