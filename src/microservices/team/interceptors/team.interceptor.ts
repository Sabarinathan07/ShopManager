import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TeamValidator } from '../helpers/';

@Injectable()
export class TeamInterceptor implements NestInterceptor {
    constructor(private teamValidator: TeamValidator) {}
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const handler = context.getHandler().name;
        let errors: string[] = [];

        if (handler === 'getTeamById') {
            errors = this.teamValidator.validateTeamUUID(req);
        }

        if (handler === 'createTeam') {
            errors = this.teamValidator.validateCreateTeam(req);
        }

        if (handler === 'addMember') {
            errors = this.teamValidator.validateMembersUUIDArray(req);
        }

        if (handler === 'removeMember') {
            errors = this.teamValidator.validateMembersUUIDArray(req);
        }

        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }
        return next.handle();
    }
}
