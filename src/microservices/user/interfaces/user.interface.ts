import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../../microservices/user/enums/';
import { Team } from 'src/microservices/team/entity/team.entity';

export class UserInterface {
    id: string;
    @ApiProperty()
    email: string;
    @ApiPropertyOptional()
    name?: string;
    @ApiProperty()
    password?: string;
    @ApiPropertyOptional()
    role?: Role;
    token?: string;
    team_id?: Team;
}
