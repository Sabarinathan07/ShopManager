import { GeneralValidators } from 'src/helpers';

export class TeamValidator {
    validateTeamUUID(req: any): string[] {
        const errors: string[] = [];
        const teamId = req.params.id;
        if (!teamId) {
            errors.push('ID is required');
        } else if (!GeneralValidators.isValidUUID(teamId)) {
            errors.push('ID should be a valid UUID');
        }
        return errors;
    }

    validateMembersUUIDArray(req: any): string[] {
        const errors: string[] = [];
        const memberIds = req.body.members;
        memberIds.forEach((memberId: string) => {
            if (!GeneralValidators.isValidUUID(memberId)) {
                errors.push('Invalid user UUID: ' + memberId);
            }
        });
        return errors;
    }

    validateCreateTeam(req: any): string[] {
        const errors: string[] = [];
        const name = req.body.name;
        if (!name) {
            errors.push('Team name is required');
        } else if (typeof name !== 'string') {
            errors.push('Team name must be of type String');
        }

        return errors;
    }
}
