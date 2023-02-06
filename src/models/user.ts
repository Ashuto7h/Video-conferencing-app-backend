import { Schema, model } from 'mongoose';
import validator from 'validator';
import { IOrganization } from './organization';

export interface IUser {
  id: string;
  email: string;
  imageUrl: string;
  name: string;
  organizations: IOrganization[];
  password?: string;
  tokens: { token: string }[];
  changedDefaultPassword: boolean;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
      validate: (value: string) => {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        }
      },
    },
    imageUrl: {
      type: String,
    },
    name: {
      required: true,
      trim: true,
      type: String,
    },
    organizations: [
      {
        ref: 'Organization',
        required: true,
        type: Schema.Types.ObjectId,
      },
    ],
    password: {
      minlength: 8,
      trim: true,
      type: String,
      validate: (value: string) => {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    tokens: [
      {
        token: {
          required: true,
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser>('User', userSchema);
