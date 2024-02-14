import { Request } from 'express';
import { GeneralValidators } from '../../../helpers';

export class ItemValidator {
    validateCreateItem(req: Request): string[] {
        const { name, quantity, price } = req.body;
        const errors: string[] = [];

        if (!name) {
            errors.push('Name is required');
        } else if (typeof name !== 'string') {
            errors.push('Name should be a string');
        }

        if (!quantity) {
            errors.push('Quantity is required!');
        } else if (typeof quantity !== 'number') {
            errors.push('Quantity must be a number');
        } else if (quantity < 0) {
            errors.push("Quantity can't be a negative value");
        }

        if (!price) {
            errors.push('Price is required!');
        } else if (typeof price !== 'number') {
            errors.push('Price must be a number');
        } else if (price < 0) {
            errors.push("Price can't be a negative value");
        }

        return errors;
    }
    validateUpdateItem(req: Request): string[] {
        const { name, quantity, price } = req.body;
        const errors: string[] = [];

        if (!name && !quantity && !price) {
            errors.push(
                'At least one field (name, quantity, price) is required',
            );
        }

        if (name && typeof name !== 'string') {
            errors.push('Name should be a string');
        }

        if (quantity && typeof quantity !== 'number') {
            errors.push('Quantity must be a number');
        }

        if (price && typeof price !== 'number') {
            errors.push('Price must be a number');
        }

        return errors;
    }
    validateItemUUID(req: any): string[] {
        const errors: string[] = [];
        const itemId = req.params.id;
        if (!itemId) {
            errors.push('ID is required');
        } else if (!GeneralValidators.isValidUUID(itemId)) {
            errors.push('ID should be a valid UUID');
        }
        return errors;
    }
}
