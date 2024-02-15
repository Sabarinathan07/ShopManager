import { Injectable } from '@nestjs/common';
import { TeamInterface } from '../interfaces';
import { customRequest } from '../../user/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserService } from 'src/microservices/user';
import { Team } from '../entity/team.entity';
import { TeamService } from './team.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserTeamService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Team) private teamRepo: Repository<Team>,
        private readonly userService: UserService,
        private readonly teamService: TeamService,
    ) {}

    async createTeam(req: customRequest, body: TeamInterface) {
        // if user is admin or already in a team, he should not able to create
        const newTeam = new Team();
        newTeam.name = body.name;
        newTeam.admin = req.currentUser;

        const res = await this.userRepo
            .createQueryBuilder()
            .insert()
            .into(Team)
            .values(newTeam)
            .execute();

        const user = await this.userService.findById(
            req.currentUser.id,
        );
        if (user) {
            user.team = res.identifiers[0].id;
            user.teamadmin = true;
            await this.userRepo
                .createQueryBuilder()
                .update(User)
                .set(user)
                .where('id = :userId', { userId: req.currentUser.id })
                .execute();
        }

        return newTeam;
    }

    async removeMembersfromTeam(
        req: customRequest,
        id: string,
        body: TeamInterface,
    ) {
        const team = await this.teamService.getTeamById(id);
        for (const memberId of body.members) {
            // use try and catch
            const user = await this.userService.findById(memberId);
            user.team = null;
            await this.userRepo.save(user);
        }
        return team;
    }

    async addMembersToTeam(
        req: customRequest,
        id: string,
        body: TeamInterface,
    ) {
        const team = await this.teamService.getTeamById(id);
        console.log(id);
        console.log(team);
        console.log(body.members);
        for (const memberId of body.members) {
            // use try and catch
            const user = await this.userService.findById(memberId);
            user.team = team;
            await this.userRepo.save(user);
        }
        return team;
    }

    async deleteTeam(id: string, req: customRequest) {
        // const users = await this.userService.getUsersByTeamId(id);

        // console.log(users);

        await this.userRepo
            .createQueryBuilder()
            .update(User)
            .set({
                team: null,
                teamadmin: false,
            })
            .where('teamId = :id', { id })
            .execute();

        await this.userRepo
            .createQueryBuilder()
            .update(User)
            .set({
                team: null,
                teamadmin: false,
            })
            .where('id = :userId', { userId: req.currentUser.id })
            .execute();

        await this.teamRepo
            .createQueryBuilder()
            .delete()
            .from(Team)
            .where('id = :id', { id })
            .execute();
    }
}
