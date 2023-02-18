import bcrypt from 'bcryptjs';
import { User } from '../models/user';
import { responseHandler } from '../utils/responseHandler';
import userDbService from '../services/user';
import { Request, Response } from 'express';

/**
 * POST `/api/v1/user/login`
 * @example
 * body: {
 *    email: 'abc@xyz.com',
 *    password: 'pqrs'
 * }
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email: userEmail, password } = req.body;
    const user = await userDbService.findByCredentials(userEmail, password);
    const token = await userDbService.generateAuthToken(user);
    const message = { ...user, success: true, token };
    responseHandler(req, res, 200, message);
  } catch (error) {
    responseHandler(req, res, 400, error);
  }
};

export const updateProfilePicture = async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;
    if (req.user) {
      req.user.imageUrl = imageUrl;
      await req.user?.save();
    }
    responseHandler(req, res, 200, { user: req.user });
  } catch (error) {
    responseHandler(req, res, 500, error);
  }
};

/**
 * POST `/api/v1/user/signup`
 * @example
 * body: {
 *    email: 'abc@xyz.com',
 *    password: 'pqrs',
 *    name: 'abcd'
 * }
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    const password = await bcrypt.hash(req.body.password, 8);
    const user = new User({ email, name, password });
    await user.save();
    responseHandler(req, res, 200, null);
  } catch (error) {
    responseHandler(req, res, 400, error);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { newPassword } = req.body;
    const user = await userDbService.findByCredentials(
      req.body.userId,
      req.body.password,
    );

    // Reflecting that password has been reset once
    if (!user.changedDefaultPassword) {
      user.changedDefaultPassword = true;
    }
    user.password = newPassword;
    user.save();
    responseHandler(req, res, 200, '');
  } catch (error) {
    responseHandler(req, res, 400, error);
  }
};

export const getUserById = (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = User.findById(userId);

    if (!user) {
      responseHandler(req, res, 404, '');
    }

    responseHandler(req, res, 200, { user });
  } catch (error) {
    responseHandler(req, res, 500, '');
  }
};

export const deleteUser = (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    let user = User.findById(userId);

    if (!user) {
      responseHandler(req, res, 404, '');
    }

    user = User.findOneAndDelete({ _id: userId });

    responseHandler(req, res, 200, { user });
  } catch (error) {
    responseHandler(req, res, 500, error);
  }
};

export const getAllUsers = (req: Request, res: Response) => {
  try {
    const users = User.find({}, ['-password', '-tokens', '-__v']);
    responseHandler(req, res, 200, { users });
  } catch (error) {
    responseHandler(req, res, 500, error);
  }
};

/**
 * POST /api/v1/user/auth/google
 * @example
 * body: {
 *  email: 'abc@xyz.com'
 *  name: 'defgh'
 *  imageUrl: 'https://image-url.authgoogle.com'
 *  token: 'eowefuUerldfmwle.ekrowmkfsUerd.....f.owUiefdwlerlesdurews'
 * }
 */

export const loginWithGoogle = async (req: Request, res: Response) => {
  try {
    const { email, name, imageUrl, token } = req.body;
    let user = await User.findOne({ email }).exec();
    if (user) {
      user = await User.findOneAndUpdate(
        { email },
        {
          $push: { tokens: { token } },
          email,
          imageUrl,
          name,
        },
      ).exec();
    } else {
      user = new User({
        email,
        imageUrl,
        name,
        tokens: [{ token }],
      });
      await user.save();
    }
    responseHandler(req, res, 200, { user });
  } catch (error) {
    responseHandler(req, res, 500, error);
  }
};
