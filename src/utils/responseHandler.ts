import { Request, Response } from 'express';
import { logger } from './logger';

export const messageResponses: Record<number, string> = {
  200: 'Success',
  201: 'Created',
};

export const errorResponses: Record<number, string> = {
  400: 'Bad Request',
  401: 'Please Login',
  403: 'Unauthorized',
  404: 'Not Found',
  500: 'Internal Server Error',
};

export const responseHandler = (
  req: Request,
  res: Response,
  code: number,
  message: unknown,
  error?: Error,
) => {
  try {
    if (error) {
      res.status(code).send({ error: error.toString() });
      logger.error(`${req.originalUrl} ${code}  ${JSON.stringify(error)}`);
    } else if (message) {
      res.status(code).send(message);
      logger.log(`${req.originalUrl} ${code}  ${JSON.stringify(message)}`);
    } else if (errorResponses[code]) {
      res.status(code).send({ error: errorResponses[code] });
      logger.error(`${req.originalUrl} ${code}  ${errorResponses[code]}`);
    } else if (messageResponses[code]) {
      res.status(code).send({ message: messageResponses[code] });
      logger.log(`${req.originalUrl} ${code}  ${messageResponses[code]}`);
    } else {
      res.status(code).send();
    }
    // Throw new Error();
  } catch (err) {
    logger.error(err);
  }
};
