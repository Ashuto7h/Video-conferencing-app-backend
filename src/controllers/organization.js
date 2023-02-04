/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { Organization } from '../models/organization';
import { responseHandler } from '../utils/responseHandler';
import { User } from '../models/user';

/**
 * POST `/api/v1/user/login`
 * @example
 * body: {
 *    email: 'abc@xyz.com',
 *    password: 'pqrs'
 * }
 */
export const createOrganization = async (req, res) => {
  try {
    const { name, members } = req.body;
    const admin = req.user.id;
    const organization = new Organization({ admin, members, name });
    await organization.save();
    req.user.organizations.push(organization.id);
    await req.user.save();
    members.forEach(async (memberEmail) => {
      const user = User.findOne({ memberEmail });
      await user.organizations.push(organization.id);
      await user.save();
    });
    responseHandler(req, res, 200, null, organization);
  } catch (error) {
    responseHandler(req, res, 400, error);
  }
};

export const fetchUserOrganization = (req, res) => {
  try {
    const user = User.findById(req.user.id).populate({
      model: 'Organization',
      path: 'organizations',
      populate: {
        model: 'User',
        path: 'members',
      },
    });
    const result = user.organizations;

    responseHandler(req, res, 200, null, result);
  } catch (error) {
    responseHandler(req, res, 400, error);
  }
};

export const fetchOrganizationWithUsers = (req, res) => {
  try {
    const { orgId } = req.body;
    const org = Organization.findById(orgId).populate('members');
    responseHandler(req, res, 200, null, org);
  } catch (error) {
    responseHandler(req, res, 400, error);
  }
};

export const deleteOrganization = (req, res) => {
  try {
    const { orgId } = req.body;
    const org = Organization.findById(orgId);
    if (org.admin.toString() !== req.user._id.toString()) {
      responseHandler(req, res, 403, null);
    } else {
      org.members.forEach(async (userId) => {
        const user = User.findById(userId);
        user.organizations = user.organizations.filter(
          (organization) => organization !== orgId,
        );
        await user.save();
      });
      Organization.findByIdAndDelete(org._id);
      responseHandler(req, res, 200, null);
    }
  } catch (error) {
    responseHandler(req, res, 400, error);
  }
};

export const addMember = async (req, res) => {
  try {
    const { email, orgId } = req.body;
    const org = Organization.findById(orgId);
    const memberToBe = User.findOne({ email });
    if (!memberToBe) {
      return responseHandler(req, res, 200, 'user not found');
    }
    if (org.admin.toString() !== req.user._id.toString()) {
      return responseHandler(req, res, 403, null);
    }
    if (org.members.includes(memberToBe._id)) {
      return responseHandler(req, res, 400, null, 'Already a member');
    }
    const user = User.findById(memberToBe._id);
    org.members.push(memberToBe._id);
    user.organizations.push(org._id);
    await user.save();
    await org.save();
    return responseHandler(req, res, 200, null, { success: true, user });
  } catch (error) {
    return responseHandler(req, res, 400, error);
  }
};

export const removeMember = async (req, res) => {
  try {
    const { userId, orgId } = req.body;
    const org = Organization.findById(orgId);
    if (org.admin.toString() !== req.user._id.toString()) {
      responseHandler(req, res, 403, null);
    } else if (!org.members.includes(userId)) {
      responseHandler(req, res, 404, null, 'Not a member');
    } else {
      const user = User.findById(userId);
      user.organizations = user.organizations.filter(
        (organization) => organization != orgId,
      );
      org.members = org.members.filter((member) => member != userId);
      await user.save();
      await org.save();
      responseHandler(req, res, 200, null, null);
    }
  } catch (error) {
    responseHandler(req, res, 400, error);
  }
};
