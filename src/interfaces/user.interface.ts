import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'src/enums/Role';

export class UserInterface {
    @ApiProperty()
    email: string;
    @ApiPropertyOptional()
    name?: string;
    @ApiProperty()
    password: string;
    @ApiPropertyOptional()
    role?: Role;
}
