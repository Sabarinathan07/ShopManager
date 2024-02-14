import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../../microservices/user/enums/Role';

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
}
