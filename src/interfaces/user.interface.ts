import { Role } from 'src/enums/Role';

export interface UserInterface {
    email: string;
    name?: string;
    password: string;
    role?: Role;
}
