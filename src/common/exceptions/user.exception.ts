import { Exception } from './interfaces/exception.interface';

export interface UserDetails {
    username?: string;
}

export const userNotFound = (details: UserDetails): Exception<UserDetails> => ({
    code: 'userNotFound',
    message: 'Unable to find user',
    details,
});
