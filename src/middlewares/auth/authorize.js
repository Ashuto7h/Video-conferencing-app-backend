import { responseHandler } from '../../utils/responseHandler';

export const hasRole = (roles = []) => {
  let roleList = roles;
  if (typeof roleList === 'string') {
    roleList = [roleList];
  }

  return (req, res, next) => {
    if (roleList.length !== 0 && !roleList.includes(req.user.role)) {
      // User's role is not authorized
      responseHandler(req, res, 401);
    }

    // Authentication and authorization successful
    next();
  };
};
