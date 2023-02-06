import { createLogger, format, transports } from 'winston';

const { timestamp, combine, errors } = format;

const loghelper = createLogger({
  format: combine(timestamp(), errors({ stack: true }), format.colorize()),
  transports: [
    new transports.File({ filename: 'logs/complete.log' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

const logHandler = {
  error(message: unknown) {
    loghelper.error({ level: 'error', message });
  },
  log(message: string) {
    loghelper.log({ level: 'info', message });
  },
};

export const logger = logHandler;
