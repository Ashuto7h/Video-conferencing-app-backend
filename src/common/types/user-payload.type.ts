import { IncomingMessage } from 'http';

export interface UserPayload {
    username: string;
}

export type RequestWithUser = IncomingMessage & { user?: UserPayload };
