/* eslint-disable no-use-before-define */
import cors from 'cors';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { ExpressPeerServer } from 'peer';
import config from './configs';
import { initializeSocket } from './socketInstance';
import { logger } from './utils/logger';
import { printRoutes } from './utils/route-printer';

const app = express();
const httpSever = createServer(app);
initializeSocket(httpSever);

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  const { origin } = req.headers;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

if (!config.mongoDBUrl) {
  throw new Error('mongoDBUrl not found in config');
}
mongoose.connect(config.mongoDBUrl);
mongoose.set('strictQuery', false);

app.get('/', (req: Request, res: Response) =>
  res.send('Video Conference Web App backend.\nhealth check : passing'),
);

import('./routes').then(({ rootRouter }) => {
  app.use('/api/v1', rootRouter);
  app._router.stack.forEach(printRoutes.bind(null, []));
});

app.use(
  '/peerjs',
  // eslint-disable-next-line camelcase
  ExpressPeerServer(httpSever, { allow_discovery: true }),
);

httpSever.listen(config.port, () => {
  logger.log(`Server is Listening on port ${config.port}`);
});
