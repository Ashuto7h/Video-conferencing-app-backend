import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Meet, MeetingTypes } from '../models/meet';
import { responseHandler } from '../utils/responseHandler';
import '../index.d';

export const createNewMeet = async (req: Request, res: Response) => {
  const { type, title } = req.body;
  let { orgId } = req.body;
  try {
    const meetingCode = uuidv4();
    if (type !== MeetingTypes.ORGANIZATION) {
      orgId = null;
    }
    const meet = new Meet({
      host: req.user?.id,
      meetingCode,
      orgId,
      title,
      type,
    });
    await meet.save();
    responseHandler(req, res, 200, meet);
  } catch (error) {
    responseHandler(req, res, 400, '');
  }
};

export const getMeetingByCode = (meetingCode: string) => {
  const meet = Meet.findOne({ meetingCode });
  if (!meet) {
    throw Error(`Meeting by ${meetingCode} is not found`);
  }
  return meet;
};
