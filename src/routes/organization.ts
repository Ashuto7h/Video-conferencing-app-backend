import express from 'express';
import {
  addMember,
  createOrganization,
  deleteOrganization,
  fetchOrganizationWithUsers,
  fetchUserOrganization,
  removeMember,
} from '../controllers/organization';
import { authenticate } from '../middlewares/auth';

const organizationRouter = express.Router();

organizationRouter.post('/create', authenticate, createOrganization);
organizationRouter.post('/add-member', authenticate, addMember);
organizationRouter.put('/remove-member', authenticate, removeMember);
organizationRouter.delete('/delete-org', authenticate, deleteOrganization);
organizationRouter.get('/user-org', authenticate, fetchUserOrganization);
organizationRouter.post('/fetch-org', authenticate, fetchOrganizationWithUsers);

export { organizationRouter };
