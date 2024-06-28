import { Request } from 'express';
import { IUser } from '../mongodb/models/user';

// Extend the Request interface from Express
export interface CustomRequest extends Request {
  user?: IUser; // Replace `YourUserType` with the actual type of your user object
}