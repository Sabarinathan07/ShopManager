import { User, UserService } from 'src/microservices/user';
import { customRequest } from './../../user/interfaces/request.interface';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { TeamService } from '../services/team.service';
import { TeamInterface } from '../interfaces';
import { UserTeamService } from '../services/user-team.service';
import { TeamAdminGuard } from 'src/guards/TeamAdminGuard';
import { TeamInterceptor } from '../interceptors/team.interceptor';

@Controller('/api/team')
@UseInterceptors(TeamInterceptor)
export class TeamController {
    constructor(
        private teamService: TeamService,
        private userService: UserService,
        private userTeamService: UserTeamService,
    ) {}

    @Get()
    async getAllTeam() {
        return await this.teamService.getAllTeam();
    }

    @Get('/:id')
    async getTeamById(@Param('id') id: string) {
        return await this.userService.getUsersByTeamId(id);
    }

    @Post()
    async createTeam(
        @Body() body: TeamInterface,
        @Req() req: customRequest,
    ) {
        return await this.userTeamService.createTeam(req, body);
    }

    @Put('/')
    @UseGuards(TeamAdminGuard)
    async addMember(
        @Body() body: TeamInterface,
        @Req() req: customRequest,
    ) {
        return await this.userTeamService.addMembersToTeam(req, body);
    }

    @Put('/remove-members/')
    @UseGuards(TeamAdminGuard)
    async removeMember(
        @Body() body: TeamInterface,
        @Req() req: customRequest,
    ) {
        return await this.userTeamService.removeMembersfromTeam(
            req,
            body,
        );
    }

    @Delete('/delete')
    @UseGuards(TeamAdminGuard)
    async deleteTeam(@Req() req: customRequest) {
        return await this.userTeamService.deleteTeam(req);
    }
}
