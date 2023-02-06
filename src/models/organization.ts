import { Schema, model } from 'mongoose';
import { IUser } from './user';

export interface IOrganization {
  admin: IUser;
  members: IUser[];
  name: string;
}

const organizationSchema = new Schema<IOrganization>(
  {
    admin: {
      ref: 'User',
      required: true,
      trim: true,
      type: Schema.Types.ObjectId,
    },
    members: [
      {
        ref: 'User',
        required: true,
        type: Schema.Types.ObjectId,
      },
    ],
    name: {
      required: true,
      trim: true,
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Organization = model<IOrganization>(
  'Organization',
  organizationSchema,
);
