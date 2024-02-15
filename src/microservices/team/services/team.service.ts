import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '../entity/team.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeamService {
    constructor(
        @InjectRepository(Team) private repo: Repository<Team>,
    ) {}

    async getAllTeam() {
        return await this.repo
            .createQueryBuilder('team')
            .leftJoinAndSelect('team.admin', 'user.id')
            .getMany();
    }

    // error in getTeam By id
    async getTeamById(id: string) {
        try {
            console.log(id);
            const found = await this.repo
                .createQueryBuilder('team')
                // .leftJoinAndSelect('team.admin', 'user.id') // Assuming 'admin' is the property in Team entity referring to the admin user
                .where('team.id = :id', { id })
                .getOne();

            if (!found) {
                throw new NotFoundException('Team not found');
            }

            console.log(found);
            return found;
        } catch (error) {
            throw new NotFoundException('Could not find item');
        }
    }
}
