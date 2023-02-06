/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { Organization } from '../models/organization';
import { responseHandler } from '../utils/responseHandler';
import { User } from '../models/user';
import { Request, Response } from 'express';

/**
 * POST `/api/v1/user/login`
 * @example
 * body: {
 *    email: 'abc@xyz.com',
 *    password: 'pqrs'
 * }
 */
export const createOrganization = async (req: Request, res: Response) => {
  try {
    const { name, members } = req.body;
    const admin = req.user?.id;
    const organization = new Organization({ admin, members, name });
    await organization.save();
    req.user?.organizations.push(organization.id);
    await req.user?.save();
    members.forEach(async (memberEmail: string) => {
      const user = await User.findOne({ memberEmail }).exec();
      user?.organizations.push(organization.id);
      await user?.save();
    });
    responseHandler(req, res, 200, organization);
  } catch (error) {
    responseHandler(req, res, 400, error);
  }
};

export const fetchUserOrganization = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id)
      .populate({
        model: 'Organization',
        path: 'organizations',
        populate: {
          model: 'User',
          path: 'members',
        },
      })
      .exec();
    const result = user?.organizations;

    responseHandler(req, res, 200, result);
  } catch (error) {
    responseHandler(req, res, 400, error);
  }
};

export const fetchOrganizationWithUsers = (req: Request, res: Response) => {
  try {
    const { orgId } = req.body;
    const org = Organization.findById(orgId).populate('members');
    responseHandler(req, res, 200, org);
  } catch (error) {
    responseHandler(req, res, 400, error);
  }
};

export const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.body;
    const org = await Organization.findById(orgId).exec();
    if (org?.admin.toString() !== req.user?._id.toString()) {
      responseHandler(req, res, 403, null);
    } else {
      org?.members.forEach(async (userId) => {
        const user = await User.findById(userId).exec();
        if (user) {
          user.organizations = user.organizations.filter(
            (organization) => organization !== orgId,
          );
          await user.save();
        }
      });
      Organization.findByIdAndDelete(org?._id);
      responseHandler(req, res, 200, null);
    }
  } catch (error) {
    responseHandler(req, res, 400, error);
  }
};

export const addMember = async (req: Request, res: Response) => {
  try {
    const { email, orgId } = req.body;
    const org = await Organization.findById(orgId).exec();
    if (!org) {
      return responseHandler(req, res, 404, {
        message: 'Org id not found',
        success: false,
      });
    }
    const memberToBe = await User.findOne({ email }).exec();
    if (!memberToBe) {
      return responseHandler(req, res, 200, 'user not found');
    }
    if (org?.admin.toString() !== req.user?._id.toString()) {
      return responseHandler(req, res, 403, null);
    }
    if (org?.members.includes(memberToBe)) {
      return responseHandler(req, res, 400, 'Already a member');
    }
    const user = await User.findById(memberToBe._id).exec();
    org?.members.push(memberToBe);
    if (org) {
      user?.organizations?.push(org);
      await user?.save();
      await org?.save();
    }
    return responseHandler(req, res, 200, { success: true, user });
  } catch (error) {
    return responseHandler(req, res, 400, error);
  }
};

export const removeMember = async (req: Request, res: Response) => {
  try {
    const { userId, orgId } = req.body;
    const org = await Organization.findById(orgId).exec();
    if (org?.admin.toString() !== req.user?._id.toString()) {
      responseHandler(req, res, 403, null);
    } else if (!org?.members.includes(userId)) {
      responseHandler(req, res, 404, 'Not a member');
    } else {
      const user = await User.findById(userId).exec();
      if (user) {
        user.organizations = user.organizations.filter(
          (organization) => organization != orgId,
        );
        await user.save();
      }
      org.members = org.members.filter((member) => member != userId);
      await org.save();
      responseHandler(req, res, 200, null);
    }
  } catch (error) {
    responseHandler(req, res, 400, error);
  }
};
