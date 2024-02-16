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
    UseInterceptors,
} from '@nestjs/common';
import { TeamService } from '../services/team.service';
import { TeamInterface } from '../interfaces';
import { UserTeamService } from '../services/user-team.service';

@Controller('/api/team')
// @UseInterceptors(TeamInterceptor)
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

    @Put('/:id')
    // add admin guard
    async addMember(
        @Param('id') id: string,
        @Body() body: TeamInterface,
        @Req() req: customRequest,
    ) {
        return await this.userTeamService.addMembersToTeam(
            req,
            id,
            body,
        );
    }

    @Put('/remove-members/:id')
    // add admin guard
    async removeMember(
        @Param('id') id: string,
        @Body() body: TeamInterface,
        @Req() req: customRequest,
    ) {
        return await this.userTeamService.removeMembersfromTeam(
            req,
            id,
            body,
        );
    }

    @Delete('/:id')
    // add admin guard
    async deleteTeam(
        @Param('id') id: string,
        @Req() req: customRequest,
    ) {
        return await this.userTeamService.deleteTeam(id, req);
    }
}
