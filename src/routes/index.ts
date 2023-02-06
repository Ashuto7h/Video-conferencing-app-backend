import { Request, Response, Router } from 'express';
import { organizationRouter } from './organization';
import { userRouter } from './user';
import { meetRouter } from './meet';

export const rootRouter = Router();
rootRouter.use('/user', userRouter);
rootRouter.use('/org', organizationRouter);
rootRouter.use('/meet', meetRouter);
rootRouter.get('/', (req: Request, res: Response) => res.send('api v1'));
