import { Request } from 'express';
export interface customRequest extends Request {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentUser?: any;
}
