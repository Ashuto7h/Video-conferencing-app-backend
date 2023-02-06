import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../configs';
import { User } from '../models/user';

const findByCredentials = async (email: string, password: string) => {
  const user = await User.findOne({ email }, ['-__v']).exec();
  if (!user) {
    throw new Error('invalid creds');
  }
  const isMatch = await bcrypt.compare(password, user.password || '');
  if (!isMatch) {
    throw new Error('invalid creds');
  }
  delete user.password;
  return user;
};

const generateAuthToken = async (user: TUserDoc) => {
  const userRef = user;
  const token = jwt.sign({ _id: userRef._id.toString() }, config.jwtSecret);
  await userRef.save();
  return token;
};

const userService = { findByCredentials, generateAuthToken };
export default userService;
