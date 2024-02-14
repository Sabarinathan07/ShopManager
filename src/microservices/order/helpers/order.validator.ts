import { Timeline } from '../../../microservices/order/enums/Timeline';
import { Request } from 'express';
import { GeneralValidators } from '../../../helpers/general.validators';

export class OrderValidator {
    validateCreateOrder(req: Request) {
        const { item, quantity } = req.body;
        const errors: string[] = [];

        if (!item) {
            errors.push('Item is required');
        } else if (!GeneralValidators.isValidUUID(item)) {
            errors.push('Item should be valid UUID');
        }

        if (!quantity) {
            errors.push('Quantity is required!');
        } else if (typeof quantity !== 'number') {
            errors.push('Quantity must be a number');
        } else if (quantity < 0) {
            errors.push("Quantity can't be a negative value");
        }

        return errors;
    }
    validateUpdateOrder(req: Request) {
        const errors: string[] = [];
        const { quantity } = req.body;
        if (!quantity) {
            errors.push('Quantity is required!');
        } else if (typeof quantity !== 'number') {
            errors.push('Quantity must be a number');
        } else if (quantity < 0) {
            errors.push("Quantity can't be a negative value");
        }

        return errors;
    }

    validateOrderUUID(req: any): string[] {
        const errors: string[] = [];
        const orderId = req.params.id;
        if (!orderId) {
            errors.push('ID is required');
        } else if (!GeneralValidators.isValidUUID(orderId)) {
            errors.push('ID should be a valid UUID');
        }
        return errors;
    }

    validateGetAmountRequest(req: Request) {
        const errors: string[] = [];

        if (req.params.timeline == Timeline.day) {
            const { date } = req.body;

            if (!date) {
                errors.push('Date is required');
            }
        } else if (req.params.timeline == Timeline.week) {
            const { week, year } = req.body;
            if (!week) {
                errors.push('Week is required');
            } else if (week < 1 || week > 52) {
                errors.push(
                    'Invalid week number, Week should be  between 1 and 52',
                );
            }

            if (!year) {
                errors.push('Year is required');
            } else if (year < 2000 && year > 2050) {
                errors.push(
                    'Invalid Year, Please enter a valid year from 2000 to 2050',
                );
            }
        } else if (req.params.timeline == Timeline.month) {
            const { month, year } = req.body;
            if (!month) {
                errors.push('Month is missing in the request body');
            } else if (month > 12 || month < 1) {
                errors.push(
                    'Invalid Month! Please enter a valid month from 1 to 12',
                );
            }

            if (!year) {
                errors.push('Year is required');
            } else if (year < 2000 || year > 2050) {
                errors.push(
                    'Invalid Year, Please enter a valid year from 2000 to 2050',
                );
            }
        }

        return errors;
    }
}
