import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import config from '../configs';

const findByCredentials = async (email, password) => {
  const user = User.findOne({ email }, ['-__v']);
  if (!user) {
    throw new Error('invalid creds');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('invalid creds');
  }
  delete user.password;
  return user;
};

const generateAuthToken = async (user) => {
  const userRef = user;
  const token = jwt.sign({ _id: userRef._id.toString() }, config.jwtSecret);
  await userRef.save();
  return token;
};

const userService = { findByCredentials, generateAuthToken };
export default userService;
