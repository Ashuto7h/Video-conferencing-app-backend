import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { ExpressPeerServer } from 'peer';
import config from './configs';
import { initializeSocket } from './socketInstance';
import { logger } from './utils/logger';

const app = express(),
  httpSever = createServer(app);
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
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

mongoose.connect(config.mongoDBUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/', (req, res) =>
  res.send('Video Conference Web App backend.\nhealth check : passing'),
);

const split = (thing) => {
  if (typeof thing === 'string') {
    return thing.split('/');
  }
  if (thing.fast_slash) {
    return '';
  }
  const match = thing
    .toString()
    .replace('\\/?', '')
    .replace('(?=\\/|$)', '$')
    .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//u);
  return match
    ? match[1].replace(/\\(.)/gu, '$1').split('/')
    : `<complex:${thing.toString()}>`;
};

const printRoutes = (path, layer) => {
  if (layer.route) {
    layer.route.stack.forEach(
      printRoutes.bind(null, path.concat(split(layer.route.path))),
    );
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(
      printRoutes.bind(null, path.concat(split(layer.regexp))),
    );
  } else if (layer.method) {
    // eslint-disable-next-line no-console
    console.log(
      '%s /%s',
      layer.method.toUpperCase().padEnd(10),
      path.concat(split(layer.regexp)).filter(Boolean).join('/'),
    );
  }
};

import('./routes').then(({ rootRouter }) => {
  app.use('/api/v1', rootRouter);
  app._router.stack.forEach(printRoutes.bind(null, []));
});

app.use(
  '/peerjs',
  // eslint-disable-next-line camelcase
  ExpressPeerServer(httpSever, { allow_discovery: true, debug: true }),
);

httpSever.listen(config.port, () => {
  logger.log('info', `Server is Listening on port ${config.port}`);
});
