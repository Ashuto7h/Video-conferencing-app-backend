import { Exception } from './interfaces/exception.interface';

export const InvalidToken = (): Exception => ({
    message: 'Invalid token provided',
    code: 'InvalidToken',
});
