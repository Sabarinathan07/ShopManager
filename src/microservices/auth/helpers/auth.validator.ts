import { Request } from 'express';
import { Role } from 'src/microservices/user/enums/Role';
import { GeneralValidators } from '../../../helpers/general.validators';

export class AuthValidator {
    validateCreateUser(req: Request): string[] {
        const { name, email, password, role } = req.body;
        const errors: string[] = [];

        if (!name) {
            errors.push('Name is required');
        } else if (typeof name !== 'string') {
            errors.push('Name should be a string');
        }

        if (!email) {
            errors.push('Email is required');
        } else if (!GeneralValidators.isValidEmail(email)) {
            errors.push('Invalid email format');
        }

        if (!password) {
            errors.push('Password is required');
        } else if (password.length < 6) {
            errors.push(
                'Password must be at least 6 characters long',
            );
        }

        if (role && !Role[role]) {
            errors.push(
                'Invalid role! Role can be customer or shopkeeper',
            );
        }

        return errors;
    }

    validateLoginUser(req: Request): string[] {
        const { email, password } = req.body;
        const errors: string[] = [];

        if (!email) {
            errors.push('Email is required');
        } else if (!GeneralValidators.isValidEmail(email)) {
            errors.push('Invalid email format');
        }

        if (!password) {
            errors.push('Password is required');
        } else if (password.length < 6) {
            errors.push(
                'Password must be at least 6 characters long',
            );
        }
        return errors;
    }
}
