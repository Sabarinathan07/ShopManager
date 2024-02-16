import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class TeamAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        if (!request.currentUser) {
            throw new UnauthorizedException('You are not logged in');
        }

        const isTeamAdmin = request.currentUser.teamadmin;
        if (!isTeamAdmin) {
            throw new ForbiddenException('Only admin have access');
        }

        return isTeamAdmin;
    }
}
