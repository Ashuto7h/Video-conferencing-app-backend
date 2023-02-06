import { Document, Types } from 'mongoose';
import { IUser } from './models/user';

declare global {
  type TUserDoc = Document<unknown, unknown, IUser> &
    IUser & {
      _id: Types.ObjectId;
    };
  namespace Express {
    export interface Request {
      token?: string;
      user?: TUserDoc;
    }
  }
}
