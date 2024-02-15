import { Module } from '@nestjs/common';
import { TeamController } from './controllers/team.controller';
import { TeamService } from './services/team.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entity/team.entity';
import { TeamValidator } from './helpers/team.validator';
import { UserTeamService } from './services/user-team.service';
import { User, UserService } from '../user';

@Module({
    imports: [TypeOrmModule.forFeature([Team, User])],
    controllers: [TeamController],
    providers: [
        TeamService,
        TeamValidator,
        UserTeamService,
        UserService,
    ],
    exports: [TeamService],
})
export class TeamModule {}
