import { Schema, model } from 'mongoose';

export enum MeetingTypes {
  OPEN_TO_ALL,
  ORGANIZATION,
  RESTRICTED,
}

const meetSchema = new Schema(
  {
    endTime: {
      type: Date,
    },
    host: {
      ref: 'User',
      required: true,
      trim: true,
      type: Schema.Types.ObjectId,
    },
    joinedMemberList: [
      {
        ref: 'User',
        required: true,
        type: Schema.Types.ObjectId,
      },
    ],
    logs: [
      {
        message: {
          type: String,
        },
        time: {
          default: new Date(),
          type: Date,
        },
      },
    ],
    meetingCode: {
      required: true,
      type: String,
      unique: true,
    },
    numberOfParticipants: {
      type: Number,
    },
    orgId: {
      ref: 'Organization',
      trim: true,
      type: Schema.Types.ObjectId,
    },
    startTime: {
      type: Date,
    },
    title: {
      type: String,
    },
    type: {
      default: MeetingTypes.OPEN_TO_ALL,
    },
  },
  {
    timestamps: true,
  },
);

export const Meet = model('Meet', meetSchema);
