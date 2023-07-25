import { Request } from 'express';
import { Roles, Tokens } from "./constant";
import { User } from 'src/users/entity/user.entity';

export interface UserPayload {
    id: number,
    username: string,
    role: Roles,
    type?: Tokens
}

export interface RequestWithUser extends Request {
    user: UserPayload
}