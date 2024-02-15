import { GeneralValidators } from '../../../helpers/';

export class UserValidator {
    validateDeleteUser(req: any): string[] {
        const errors: string[] = [];
        const userId = req.params.id;
        if (!userId) {
            errors.push('ID is required');
        } else if (!GeneralValidators.isValidUUID(userId)) {
            errors.push('ID should be a valid UUID');
        }
        return errors;
    }
}
